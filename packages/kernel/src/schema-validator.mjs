function actualType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';
  return typeof value === 'object' ? 'object' : typeof value;
}

function typeMatches(value, expected) {
  const candidates = Array.isArray(expected) ? expected : [expected];
  const type = actualType(value);
  return candidates.some((candidate) => {
    if (candidate === 'number') return type === 'number' || type === 'integer';
    return candidate === type;
  });
}

export function validateSchema(schema, value, path = '$') {
  const errors = [];

  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
    return errors;
  }
  if (schema.enum && !schema.enum.some((item) => item === value)) {
    errors.push(`${path}: must be one of ${schema.enum.map((item) => JSON.stringify(item)).join(', ')}`);
    return errors;
  }
  if (schema.type && !typeMatches(value, schema.type)) {
    errors.push(`${path}: expected ${JSON.stringify(schema.type)}, got ${actualType(value)}`);
    return errors;
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: string is shorter than ${schema.minLength}`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}: string is longer than ${schema.maxLength}`);
    if (schema.pattern && !(new RegExp(schema.pattern)).test(value)) errors.push(`${path}: does not match ${schema.pattern}`);
  }

  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${path}: must be >= ${schema.minimum}`);
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: requires at least ${schema.minItems} items`);
    if (schema.uniqueItems) {
      const serialized = value.map((item) => JSON.stringify(item));
      if (new Set(serialized).size !== serialized.length) errors.push(`${path}: items must be unique`);
    }
    if (schema.items) {
      value.forEach((item, index) => errors.push(...validateSchema(schema.items, item, `${path}[${index}]`)));
    }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const properties = schema.properties ?? {};
    for (const required of schema.required ?? []) {
      if (!(required in value)) errors.push(`${path}.${required}: required property missing`);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) errors.push(`${path}.${key}: additional property is not allowed`);
      }
    }
    for (const [key, childSchema] of Object.entries(properties)) {
      if (key in value) errors.push(...validateSchema(childSchema, value[key], `${path}.${key}`));
    }
  }

  return errors;
}
