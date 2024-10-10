class PathBuilder {
  private pathSegments: string[];
  private pathParams: Record<string, string | number>;

  constructor(path: string = "") {
    this.pathSegments = [path];
    this.pathParams = {};
  }

  with(path: string) {
    this.pathSegments.push(path);

    return this;
  }

  params(obj: Record<string, string | number>) {
    this.pathParams = obj;

    return this;
  }

  get paramsSegments() {
    return this.pathSegments.filter((segment) => segment.startsWith(":"));
  }

  get value() {
    return this.toString();
  }

  toString() {
    return this.pathSegments.map((segment) => {
      if (segment.startsWith(":")) {
        const key = segment.slice(1);
        return this.pathParams[key];
      }

      return segment;
    }).join("/");
  }
}

export const pathBuilder = () => new PathBuilder();
