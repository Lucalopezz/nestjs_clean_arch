export type FieldsError = {
  [field: string]: string[];
};
// campo e os erros associados a ele: Nome -> ['Nome é obrigatório', 'Nome deve ter no mínimo 3 caracteres']
export interface ValidatorsFieldsInterface<PropsValidated> {
  errors: FieldsError;
  validatedData: PropsValidated;
  validate(data: any): boolean;
}
