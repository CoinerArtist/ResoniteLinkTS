export interface TypeReference{
    type: string
    isGenericParameter: boolean
    genericArguments: TypeReference[]
}