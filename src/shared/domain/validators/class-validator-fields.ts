import { validateSync } from 'class-validator';
import {
  FieldsError,
  ValidatorsFieldsInterface,
} from './validators-fields.interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorsFieldsInterface<PropsValidated>
{
  errors: FieldsError = null; // Erros encontrados durante a validação
  validatedData: PropsValidated = null; // Dados validados e prontos para uso
  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length > 0) {
      this.errors = {}; // Inicializa o objeto de erros
      // Itera sobre os erros e preenche o objeto de erros
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validatedData = data;
    }
    return !errors.length;
  }
}
