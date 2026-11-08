using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.U2D.Sprites;
using UnityEngine;

/// <summary>
/// Auto-imports tower sprite sheets under Assets/Art/Towers with the settings
/// documented in each tower's README: PPU 128, Sprite Mode Multiple, Bilinear,
/// no compression, sliced by cell size, with the correct pivot per layer.
///
/// Runs only on the first import of a PNG (when it has no .meta settings yet),
/// so manual tweaks in the Sprite Editor are kept. Use
/// Tools > Towers > Reapply Sprite Import Settings to force it again.
/// </summary>
public class TowerSpriteImporter : AssetPostprocessor
{
    const string Root = "Assets/Art/Towers/";
    const int PixelsPerUnit = 128;
    const int TowerCell = 128;

    static readonly Vector2 BasePivot = new Vector2(0.5f, 0.375f);
    static readonly Vector2 CenterPivot = new Vector2(0.5f, 0.5f);

    /// <summary>VFX sheets whose cells are not square (width x height in px).</summary>
    static readonly Dictionary<string, Vector2Int> VfxCells = new Dictionary<string, Vector2Int>
    {
        { "vfx_flame_cone", new Vector2Int(128, 64) },
        { "vfx_tesla_arc", new Vector2Int(128, 32) },
        { "vfx_repair_beam", new Vector2Int(64, 16) },
        { "vfx_wall_shield", new Vector2Int(64, 48) },
        { "vfx_frost_ring", new Vector2Int(256, 192) },
        { "vfx_heat_wave", new Vector2Int(128, 96) },
        { "vfx_mortar_target", new Vector2Int(96, 64) },
        { "vfx_piercing_bolt", new Vector2Int(64, 32) },
        { "vfx_solvent_puddle", new Vector2Int(128, 64) },
        { "vfx_storm_bolt", new Vector2Int(64, 256) },
    };

    /// <summary>VFX pivots that are not Center (normalized, origin bottom-left).</summary>
    static readonly Dictionary<string, Vector2> VfxPivots = new Dictionary<string, Vector2>
    {
        { "vfx_flame_cone", new Vector2(0f, 0.5f) },
        { "vfx_tesla_arc", new Vector2(0f, 0.5f) },
        { "vfx_repair_beam", new Vector2(0f, 0.5f) },
        { "vfx_storm_bolt", new Vector2(0.5f, 0f) },
        { "vfx_frozen", new Vector2(0.5f, 0.0625f) },
        { "vfx_mortar_blast", new Vector2(0.5f, 0.333f) },
        { "vfx_net_trap", new Vector2(0.5f, 0.1875f) },
        { "vfx_net_burst", new Vector2(0.5f, 0.1875f) },
    };

    static readonly HashSet<string> Forced = new HashSet<string>();

    void OnPreprocessTexture()
    {
        string path = assetPath.Replace('\\', '/');
        if (!path.StartsWith(Root) || !path.EndsWith(".png")) return;

        string name = Path.GetFileNameWithoutExtension(path);
        if (name.StartsWith("_")) return; // preview images, not game sprites

        if (!assetImporter.importSettingsMissing && !Forced.Remove(path)) return;

        var ti = (TextureImporter)assetImporter;
        ti.textureType = TextureImporterType.Sprite;
        ti.spriteImportMode = SpriteImportMode.Multiple;
        ti.spritePixelsPerUnit = PixelsPerUnit;
        ti.filterMode = FilterMode.Bilinear;
        ti.textureCompression = TextureImporterCompression.Uncompressed;
        ti.mipmapEnabled = false;
        ti.alphaIsTransparency = true;
        ti.wrapMode = TextureWrapMode.Clamp;

        var settings = new TextureImporterSettings();
        ti.ReadTextureSettings(settings);
        settings.spriteMeshType = SpriteMeshType.FullRect; // tiled beams and shields need Full Rect
        ti.SetTextureSettings(settings);

        ti.GetSourceTextureWidthAndHeight(out int texW, out int texH);
        Vector2Int cell = CellSize(name, texH);
        Vector2 pivot = Pivot(name);

        var factory = new SpriteDataProviderFactories();
        factory.Init();
        var provider = factory.GetSpriteEditorDataProviderFromObject(ti);
        provider.InitSpriteEditorDataProvider();

        var rects = new List<SpriteRect>();
        int cols = texW / cell.x, rows = texH / cell.y;
        for (int r = 0; r < rows; r++)
        {
            for (int c = 0; c < cols; c++)
            {
                rects.Add(new SpriteRect
                {
                    // r0 = top row of the sheet (direction S for Head/Gunner sheets)
                    name = $"{name}_r{r}_c{c}",
                    rect = new Rect(c * cell.x, texH - (r + 1) * cell.y, cell.x, cell.y),
                    alignment = SpriteAlignment.Custom,
                    pivot = pivot,
                    spriteID = GUID.Generate(),
                });
            }
        }
        provider.SetSpriteRects(rects.ToArray());

        var ids = provider.GetDataProvider<ISpriteNameFileIdDataProvider>();
        if (ids != null)
        {
            var pairs = new List<SpriteNameFileIdPair>();
            foreach (var s in rects) pairs.Add(new SpriteNameFileIdPair(s.name, s.spriteID));
            ids.SetNameFileIdPairs(pairs);
        }
        provider.Apply();
    }

    static Vector2Int CellSize(string name, int texH)
    {
        if (name.StartsWith("vfx_"))
            return VfxCells.TryGetValue(name, out var c) ? c : new Vector2Int(texH, texH);
        return new Vector2Int(TowerCell, TowerCell);
    }

    static Vector2 Pivot(string name)
    {
        if (name.StartsWith("vfx_"))
            return VfxPivots.TryGetValue(name, out var p) ? p : CenterPivot;
        if (name.Contains("_head_") || name.Contains("_gunner_")) return CenterPivot;
        return BasePivot;
    }

    [MenuItem("Tools/Towers/Reapply Sprite Import Settings")]
    static void Reapply()
    {
        foreach (string guid in AssetDatabase.FindAssets("t:Texture2D", new[] { Root.TrimEnd('/') }))
        {
            string path = AssetDatabase.GUIDToAssetPath(guid);
            Forced.Add(path);
            AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceUpdate);
        }
        Debug.Log("Tower sprites reimported with TowerSpriteImporter settings.");
    }
}
