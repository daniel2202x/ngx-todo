export interface StringField {
    stringValue: string;
}

export interface IntegerField {
    integerValue: string;
}

export type Field = StringField | IntegerField;

export function isStringField(field: Field): field is StringField {
    return 'stringValue' in field && typeof field.stringValue === 'string';
}

export function isIntegerField(field: Field): field is IntegerField {
    return 'integerValue' in field && typeof field.integerValue === 'string';
}

export interface Document {
    fields: Record<string, Field>;
}

export interface GetDocument extends Document {
    name: string;
}

export interface GetManyResponse {
    documents: GetDocument[];
}