using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.U2D.Sprites;
using UnityEngine;

/// <summary>
/// Auto-imports wax (Dị Thể Sáp), squad and VFX sprite sheets under
/// Assets/Art/Wax, Assets/Art/Squads and Assets/Art/VFX: PPU 128, Sprite Mode Multiple, Bilinear, no
/// compression, sliced by cell size, feet pivot.
///
/// Sheet layout: row 0 = S (toward camera), row 1 = E, row 2 = N; W = E with flipX.
/// Sprites are named &lt;file&gt;_r&lt;row&gt;_c&lt;frame&gt;.
///
/// Also imports the VFX sheets under Assets/Art/VFX (drawn by
/// Tools/ArtGen/gen_vfx.py): cell size and pivot of every sheet are read from
/// Assets/Art/VFX/vfx_manifest.json, so bursts and rings get a centred pivot,
/// ground effects a bottom pivot and badges/bars a bottom-centre pivot to sit
/// above the head. A VFX sheet that is not in the manifest falls back to
/// 128 px cells with a centred pivot.
///
/// Runs only on the first import of a PNG, so manual tweaks in the Sprite
/// Editor are kept. Use Tools > Units > Reapply Sprite Import Settings to force it.
/// </summary>
public class UnitSpriteImporter : AssetPostprocessor
{
    const string VfxRoot = "Assets/Art/VFX/";
    const string VfxManifestPath = "Assets/Art/VFX/vfx_manifest.json";
    static readonly string[] Roots = { "Assets/Art/Wax/", "Assets/Art/Squads/", VfxRoot };
    const int PixelsPerUnit = 128;
    const int DefaultCell = 128;

    /// <summary>Feet sit 1/8 of the cell above the bottom edge.</summary>
    static readonly Vector2 FeetPivot = new Vector2(0.5f, 0.125f);
    static readonly Vector2 CenterPivot = new Vector2(0.5f, 0.5f);

    /// <summary>File-name prefix -> cell size in px (longest prefix wins).</summary>
    static readonly Dictionary<string, Vector2Int> Cells = new Dictionary<string, Vector2Int>
    {
        { "wax_standard", new Vector2Int(160, 160) },
        { "wax_shard", new Vector2Int(64, 64) },
        { "wax_tiger_cub", new Vector2Int(64, 64) },
        { "wax_primordial", new Vector2Int(256, 256) },
        { "wax_alpha_tiger", new Vector2Int(256, 256) },
        { "wax_mother_tree", new Vector2Int(256, 256) },
        { "wax_prism", new Vector2Int(256, 256) },
        { "wax_myriad", new Vector2Int(256, 256) },
        { "wax_ultimate", new Vector2Int(192, 192) },
        { "vfx_pounce_target", new Vector2Int(128, 64) },
        { "squad_rank", new Vector2Int(32, 32) },
    };

    /// <summary>Sheets that are not standing units: centred pivot.</summary>
    static readonly HashSet<string> Centered = new HashSet<string>
    {
        "vfx_pounce_target", "squad_rank", "squad_warden_tar_trap",
    };

    static readonly HashSet<string> Forced = new HashSet<string>();

    /// <summary>One effect of vfx_manifest.json (only the fields the importer needs).</summary>
    [System.Serializable]
    class VfxEntry
    {
        public string name;
        public int[] cell;      // [width, height] in px
        public float[] pivot;   // [x from left, y from bottom], 0..1
    }

    [System.Serializable]
    class VfxManifest
    {
        public VfxEntry[] effects;
    }

    static Dictionary<string, VfxEntry> vfxEntries;
    static System.DateTime vfxManifestTime;

    /// <summary>Looks a VFX sheet up in vfx_manifest.json; null when it is not listed.</summary>
    static VfxEntry FindVfx(string name)
    {
        if (!File.Exists(VfxManifestPath)) return null;
        System.DateTime time = File.GetLastWriteTimeUtc(VfxManifestPath);
        if (vfxEntries == null || time != vfxManifestTime)
        {
            vfxEntries = new Dictionary<string, VfxEntry>();
            vfxManifestTime = time;
            try
            {
                var manifest = JsonUtility.FromJson<VfxManifest>(File.ReadAllText(VfxManifestPath));
                if (manifest != null && manifest.effects != null)
                    foreach (var e in manifest.effects)
                        if (e != null && !string.IsNullOrEmpty(e.name)) vfxEntries[e.name] = e;
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning("UnitSpriteImporter: cannot read " + VfxManifestPath + ": " + ex.Message);
            }
        }
        VfxEntry found;
        return vfxEntries.TryGetValue(name, out found) ? found : null;
    }

    static bool InRoots(string path)
    {
        foreach (var r in Roots) if (path.StartsWith(r)) return true;
        return false;
    }

    void OnPreprocessTexture()
    {
        string path = assetPath.Replace('\\', '/');
        if (!InRoots(path) || !path.EndsWith(".png")) return;

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

        ti.GetSourceTextureWidthAndHeight(out int texW, out int texH);
        Vector2Int cell = CellSize(name);
        Vector2 pivot = Centered.Contains(name) ? CenterPivot : FeetPivot;
        if (path.StartsWith(VfxRoot))
        {
            cell = new Vector2Int(DefaultCell, DefaultCell);
            pivot = CenterPivot;
            VfxEntry vfx = FindVfx(name);
            if (vfx != null)
            {
                if (vfx.cell != null && vfx.cell.Length == 2 && vfx.cell[0] > 0 && vfx.cell[1] > 0)
                    cell = new Vector2Int(vfx.cell[0], vfx.cell[1]);
                if (vfx.pivot != null && vfx.pivot.Length == 2)
                    pivot = new Vector2(vfx.pivot[0], vfx.pivot[1]);
            }
        }

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

    static Vector2Int CellSize(string name)
    {
        string best = null;
        foreach (var key in Cells.Keys)
            if (name.StartsWith(key) && (best == null || key.Length > best.Length)) best = key;
        return best != null ? Cells[best] : new Vector2Int(DefaultCell, DefaultCell);
    }

    [MenuItem("Tools/Units/Reapply Sprite Import Settings")]
    static void Reapply()
    {
        foreach (var root in Roots)
        {
            string folder = root.TrimEnd('/');
            if (!AssetDatabase.IsValidFolder(folder)) continue;
            foreach (string guid in AssetDatabase.FindAssets("t:Texture2D", new[] { folder }))
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                Forced.Add(path);
                AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceUpdate);
            }
        }
        Debug.Log("Wax, squad and VFX sprites reimported with UnitSpriteImporter settings.");
    }
}
