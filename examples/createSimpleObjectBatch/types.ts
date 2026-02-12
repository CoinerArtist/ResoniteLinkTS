import type { Component, Field, NullableType, PrimitiveType, Reference, SyncList } from "../../link/index.ts";

export type ValueField<T extends PrimitiveType | NullableType> = Component<
    `[FrooxEngine]FrooxEngine.ValueField<${T}>`, 
    {
        Value: Field<T>
    }
>

export type ReferenceField<T extends string> = Component<
    `[FrooxEngine]FrooxEngine.ReferenceField<${T}>`, 
    {
        Reference: Reference<T>
    }
>

export type ValueCopy<T extends PrimitiveType | NullableType> = Component<
    `[FrooxEngine]FrooxEngine.ValueCopy<${T}>`,
    {
        Source: Reference<`[FrooxEngine]FrooxEngine.IField<${T}>`>
        Target: Reference<`[FrooxEngine]FrooxEngine.IField<${T}>`>
        WriteBack: Field<"bool">
    }
>

export type BoxMesh = Component<
    `[FrooxEngine]FrooxEngine.BoxMesh`, 
    {
        HighPriorityIntegration: Field<"bool">
        OverrideBoundingBox: Field<"bool">
        Profile: Field<"enum", "ColorProfile">
        Size: Field<"float3">
        UVScale: Field<"float3">
        ScaleUVWithSize: Field<"bool">
    }
>

export type MeshRenderer = Component<
    `[FrooxEngine]FrooxEngine.MeshRenderer`,
    {
        Mesh: Reference<"[FrooxEngine]FrooxEngine.IAssetProvider<[FrooxEngine]FrooxEngine.Mesh>">
        Materials: SyncList<Reference<"[FrooxEngine]FrooxEngine.IAssetProvider<[FrooxEngine]FrooxEngine.Material>">>
        MaterialPropertyBlocks: SyncList<Reference<"[FrooxEngine]FrooxEngine.IAssetProvider<[FrooxEngine]FrooxEngine.MaterialPropertyBlock>">>
        ShadowCastMode: Field<"enum", "ShadowCastMode">
        MotionVectorMode: Field<"enum", "MotionVectorMode">
        SortingOrder: Field<"int">
    }
>

export type PBS_Metallic = Component<
    `[FrooxEngine]FrooxEngine.PBS_Metallic`,
    {
        AlbedoColor: Field<"colorX">
        OffsetFactor: Field<"float">
        OffsetUnits: Field<"float">
        // I'm not manually writing all of it.  I'll make a tool to autogenerate these definitions later
    }
>

export type BoxCollider = Component<
    `[FrooxEngine]FrooxEngine.BoxCollider`, 
    {
        Size: Field<"float3">
        // ...
    }
>

export type Grabbable = Component<
    `[FrooxEngine]FrooxEngine.Grabbable`, 
    {
        Scalable: Field<"bool">
        // ...
    }
>

export type TextRenderer = Component<
    `[FrooxEngine]FrooxEngine.TextRenderer`,
    {
        Text: Field<"string">
        Size: Field<"float">
        HorizontalAlign: Field<"enum", "TextHorizontalAlignement">
        VerticalAlign: Field<"enum", "TextVerticalAlignement">
        // ...
    }
>