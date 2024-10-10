import { serializeKeys } from "./util";

type KeyTransformer = "camelCase";

type Options = {
  keyForAttribute: KeyTransformer;
  maxDepth?: number;
};

// FIXME: implement
type Meta = {};

// FIXME: implement
type Links = {};

type Data = {
  id: string;
  type: string;
  attributes: Record<string, any>;
  relationships: Record<string, { data: Relationship[] | Relationship }>;
};

type Relationship = {
  id: string;
  type: string;
};

type JsonAPIData = {
  meta: Meta;
  data: Data[] | Data;
  included: Data[];
  links: Links;
};

const snakeToCamel = (key: string) => {
  for (let i = 0; i < key.length; i++) {
    if (key[i] === "_") {
      key = key.slice(0, i) + key[i + 1].toUpperCase() + key.slice(i + 2);
    }
  }

  return key;
};

const transformers: Record<KeyTransformer, (key: string) => string> = {
  camelCase: snakeToCamel,
};

export class Deserializer {
  options: Options = { keyForAttribute: "camelCase", maxDepth: 5 };
  camelCaseKeys: (data: Record<string, any>) => any;

  constructor(options: Partial<Options> = {}) {
    this.options = Object.assign(this.options, options);
    this.camelCaseKeys = serializeKeys(this.transform);
  }

  get keyTransformer() {
    return transformers[this.options.keyForAttribute];
  }

  transform = (key: string) => {
    const keyTransformer = this.keyTransformer;
    return keyTransformer(key);
  };

  call(data: JsonAPIData): Record<string, any> {
    if (Array.isArray(data.data)) {
      return {
        data: data.data.map((it) => this.resolveData(data, it)),
        meta: this.camelCaseKeys(data.meta)
      }
    }

    return {
      data: this.resolveData(data, data.data),
      meta: this.camelCaseKeys(data.meta),
    }
  }

  resolveData(data: JsonAPIData, item: Data, depth: number = 0) {
    const attributes = item.attributes
      ? this.camelCaseKeys(item.attributes)
      : {};
    const obj = {
      id: item.id,
      ...attributes,
    };

    if (depth > this.options.maxDepth!) {
      return obj;
    }

    if (!item.relationships) {
      return obj;
    }

    Object.keys(item.relationships).forEach((name: string) => {
      const relationship = item.relationships[name]?.data;
      if (!relationship) {
        return;
      }

      if (Array.isArray(relationship) && relationship.length <= 0) {
        return;
      }

      if (Array.isArray(relationship)) {
        relationship.forEach((v) => {
          const relation = data.included.find(
            (it) => it.type === v.type && it.id === v.id,
          );
          if (relation) {
            const transformedKey = this.transform(name);
            const prev = obj[transformedKey] || [];
            obj[transformedKey] = [
              ...prev,
              this.resolveData(data, relation, depth + 1),
            ];
          }
        });
      } else {
        const type = (relationship as Relationship).type;
        const id = (relationship as Relationship).id;

        const relation = data.included.find(
          (it) => it.type === type && it.id === id,
        );
        if (relation) {
          obj[this.transform(name)] = this.resolveData(data, relation, depth);
        }
      }
    });

    return obj;
  }
}
