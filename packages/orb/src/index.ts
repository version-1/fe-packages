interface Params<T> {
  _raw: T;
}

interface HandlerParams {
  dateFields?: string[];
}

export class Base<K> {
  private _raw: K;

  constructor(params: K) {
    this._raw = params;
  }

  get clone() {
    const raw = JSON.parse(JSON.stringify(this._raw));
    return new Base(raw);
  }

  get raw(): K {
    return this._raw;
  }

  setRaw(key: keyof K, value: K[keyof K]) {
    if (!Object.getOwnPropertyNames(this._raw).includes(String(key))) {
      return;
    }

    this._raw[key] = value;
  }
}

type Getter<V, T> = {
  keys: (keyof V)[];
  handler: (value: V[keyof V]) => T;
};

type Config<V, T> = {
  getters?: Getter<V, T>[];
  mutable?: boolean;
};

export const handlerFactory = <V, T>(config: Config<V, T>) => ({
  get: (target: Base<V>, key: keyof Base<V>) => {
    config.getters?.forEach((getter) => {
      if (getter.keys.includes(key as keyof V)) {
        const r = target.raw[key as keyof V];
        return getter.handler(r);
      }
    });

    if (key in target) {
      return target[key];
    }

    return target.raw[key as keyof V];
  },
  set: (_target: Base<V>, _key: keyof Base<any>, _value: any) => {
    if (!config.mutable) {
      const cloned = _target.clone;
      cloned.raw[_key as keyof V] = _value;
    }

    _target.setRaw(_key as keyof V, _value);
  },
});

export const factoryHelper =
  <T extends Record<string, any>, V extends Object>(
    modelFactory: (params: T) => V,
  ) =>
  (model: V, handler: ProxyHandler<V>) => {
    new Proxy(model, handler);
  };
