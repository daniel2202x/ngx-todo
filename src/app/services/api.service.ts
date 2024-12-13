import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';

import { map } from 'rxjs';

import { GetManyResponse, GetDocument, Document, Field, isStringField, isIntegerField } from '@app/models';

export const IS_DATABASE_REQUEST = new HttpContextToken(() => false);

const baseUrl = '/api/data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http = inject(HttpClient);

  getOne<T>(uri: string) {
    return this.http.get<GetDocument>(baseUrl + uri, this.getOptions())
      .pipe(
        map(document => this.documentToObject<T>(document))
      );
  }

  getMany<T>(uri: string) {
    return this.http.get<GetManyResponse>(baseUrl + uri, this.getOptions())
      .pipe(
        map(apiRes => apiRes.documents?.map(document => this.documentToObject<T>(document)) || [])
      );
  }

  post<T>(uri: string, body: object) {
    return this.http.post<GetDocument>(baseUrl + uri, this.objectToDocument(body), this.getOptions())
      .pipe(
        map(document => this.documentToObject<T>(document))
      );
  }

  patch<T>(uri: string, body: object) {
    // provide updateMask.fieldPaths to Firestore, otherwise all non-mentioned fields would be erased by Firestore
    const updateMask = Object.keys(body).map(field => `updateMask.fieldPaths=${field}`).join('&');
    return this.http.patch<GetDocument>(`${baseUrl}${uri}?${updateMask}`, this.objectToDocument(body), this.getOptions())
      .pipe(
        map(document => this.documentToObject<T>(document))
      );
  }

  delete(uri: string) {
    return this.http.delete(baseUrl + uri, this.getOptions());
  }

  private getOptions() {
    return {
      context: new HttpContext().set(IS_DATABASE_REQUEST, true)
    }
  }

  /**
   * Converts a document comming from Firestore to a normal JavaScript object
   */
  private documentToObject<T>(document: GetDocument) {
    const initial = { id: document.name.split('/').reverse()[0] };
    return Object.keys(document.fields).reduce((obj, key) => ({
      ...obj,
      [key]: this.getValueFromTypedField(document.fields[key])
    }), initial) as T;
  }

  private getValueFromTypedField(field: Field) {
    if (isStringField(field)) {
      return field.stringValue;
    }

    if (isIntegerField(field)) {
      return +field.integerValue;
    }

    throw new Error('unsupported field type!');
  }

  /**
   * Converts a JavaScript objects to a document compatible with Firestore
   */
  private objectToDocument(body: object): Document {
    const fields = Object.keys(body).reduce((obj, key) => ({
      ...obj,
      // @ts-expect-error we know key is in body since we're iterating over the keys of body in reduce
      [key]: this.createTypedField(body[key])
    }), {});

    return { fields };
  }

  private createTypedField(value: unknown): Field {
    switch (typeof value) {
      case 'string':
        return { stringValue: value };
      case 'number':
        return { integerValue: value.toString() };
      default:
        throw new Error('unsupported field type!');
    }
  }
}
