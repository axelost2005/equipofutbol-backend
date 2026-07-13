//validacion de equipos: un validador por campo, reutilizado por la validacion
//completa (POST/PUT) y por la parcial (PATCH)

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim() !== '';

//cada validador recibe el valor del campo y devuelve un mensaje de error, o
//null si el valor es valido
const fieldValidators = {
    name: (v) => (isNonEmptyString(v) ? null : 'name is required'),
    country: (v) => (isNonEmptyString(v) ? null : 'country is required'),
    league: (v) => (isNonEmptyString(v) ? null : 'league is required'),
    stadium: (v) => (isNonEmptyString(v) ? null : 'stadium is required'),
    founded: (v) => {
        if (!Number.isInteger(v)) return 'founded must be a valid year';
        const currentYear = new Date().getFullYear();
        if (v < 1800 || v > currentYear) return 'founded must be a valid year';
        return null;
    },
    coach: (v) => (isNonEmptyString(v) ? null : 'coach is required'),
    shortDescription: (v) =>
        isNonEmptyString(v) ? null : 'shortDescription is required',
    description: (v) => (isNonEmptyString(v) ? null : 'description is required'),
    logo: (v) =>
        typeof v === 'string' && /^\/logos\/.+$/.test(v)
            ? null
            : 'logo must be a valid logo path',
    image: (v) =>
        typeof v === 'string' && /^\/images\/.+$/.test(v)
            ? null
            : 'image must be a valid image path',
    category: (v) => (isNonEmptyString(v) ? null : 'category is required'),
    titles: (v) => {
        if (!Number.isInteger(v)) return 'titles must be a number';
        if (v < 0) return 'titles cannot be negative';
        return null;
    },
};

//campos obligatorios al crear o reemplazar por completo un equipo
const requiredFields = [
    'name', 'country', 'league', 'stadium', 'founded', 'coach',
    'shortDescription', 'description', 'category', 'titles',
];
//campos opcionales: solo se validan si vienen en el body
const optionalFields = ['logo', 'image'];

//validacion completa: todos los obligatorios deben estar y ser validos
//(se usa en POST y en PUT, que reemplaza el recurso entero)
const validateTeam = (data) => {
    const errors = [];

    for (const field of requiredFields) {
        const error = fieldValidators[field](data[field]);
        if (error) errors.push(error);
    }
    for (const field of optionalFields) {
        if (data[field] !== undefined) {
            const error = fieldValidators[field](data[field]);
            if (error) errors.push(error);
        }
    }

    return { isValid: errors.length === 0, errors };
};

//validacion parcial: solo valida los campos presentes y exige al menos uno
//(se usa en PATCH, que actualiza parcialmente)
const validateTeamPartial = (data) => {
    const errors = [];
    const updatableFields = [...requiredFields, ...optionalFields];
    const providedFields = updatableFields.filter(
        (field) => data[field] !== undefined
    );

    if (providedFields.length === 0) {
        return { isValid: false, errors: ['al menos un campo debe ser provisto'] };
    }

    for (const field of providedFields) {
        const error = fieldValidators[field](data[field]);
        if (error) errors.push(error);
    }

    return { isValid: errors.length === 0, errors };
};

module.exports = { validateTeam, validateTeamPartial };
