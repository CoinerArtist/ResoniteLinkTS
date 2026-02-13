import type { GenericParameter } from "./genericParameter.ts";
import type { TypeReference } from "./typeReference.ts";

export interface TypeDefinition{
    baseType: TypeReference
    fullTypeName: string
    assemblyName: string
    namespace: string
    name: string
    isAbstract: boolean
    isInterface: boolean
    isGenericType: boolean
    isGenericTypeDefinition: boolean
    directGenericParameterCount: number
    isEnginePrimitive: boolean
    isValueType: boolean
    isEnum: boolean
    isComponent: boolean
    isSyncObject: boolean
    isWorldElement: boolean
    isNested: boolean
    declaringType: string
    genericArguments: TypeReference[]
    genericParameters: GenericParameter[]
    interfaces: TypeReference[]
}