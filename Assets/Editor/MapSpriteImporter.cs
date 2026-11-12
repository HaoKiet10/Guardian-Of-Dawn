using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;

/// <summary>
/// Auto-imports map art under Assets/Art/Maps with the settings documented in
/// Assets/Art/Maps/README.md: one Single sprite per PNG, PPU 128 (one build cell
/// = 1 unit, same scale as the tower sprites), pivot Bottom Left so every layer
/// of a map lines up at world (0, 0), Bilinear, no compression, no mipmaps.
///
/// Runs only on the first import of a PNG (when it has no .meta settings yet),
/// so manual tweaks are kept. Use Tools > Maps > Reapply Sprite Import Settings
/// to force it again.
/// </summary>
public class MapSpriteImporter : AssetPostprocessor
{
    const string Root = "Assets/Art/Maps/";
    const int PixelsPerUnit = 128;
    const int MaxSize = 4096; // backgrounds are 2560x1536

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
        ti.spriteImportMode = SpriteImportMode.Single;
        ti.spritePixelsPerUnit = PixelsPerUnit;
        ti.filterMode = FilterMode.Bilinear;
        ti.textureCompression = TextureImporterCompression.Uncompressed;
        ti.mipmapEnabled = false;
        ti.alphaIsTransparency = true;
        ti.wrapMode = TextureWrapMode.Clamp;
        ti.maxTextureSize = MaxSize;

        var settings = new TextureImporterSettings();
        ti.ReadTextureSettings(settings);
        settings.spriteAlignment = (int)SpriteAlignment.BottomLeft;
        settings.spriteMeshType = SpriteMeshType.FullRect;
        ti.SetTextureSettings(settings);
    }

    [MenuItem("Tools/Maps/Reapply Sprite Import Settings")]
    static void Reapply()
    {
        foreach (string guid in AssetDatabase.FindAssets("t:Texture2D", new[] { Root.TrimEnd('/') }))
        {
            string path = AssetDatabase.GUIDToAssetPath(guid);
            Forced.Add(path);
            AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceUpdate);
        }
        Debug.Log("Map sprites reimported with MapSpriteImporter settings.");
    }
}
