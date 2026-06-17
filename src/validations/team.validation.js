const validateTeam = (data) => {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('name is required');
    }
    if (!data.country || typeof data.country !== 'string' || data.country.trim() === '') {
        errors.push('country is required');
    }
    if (!data.league || typeof data.league !== 'string' || data.league.trim() === '' ){
        errors.push('league is required');
    }
    if (!data.stadium || typeof data.stadium !== 'string' || data.stadium.trim() === '' ){
        errors.push('stadium is required');
    }
    if (data.founded === undefined || !Number.isInteger(data.founded)) {
        errors.push('founded must be a valid year');
    } else {
        const currentYear = new Date().getFullYear();
        if (data.founded < 1800 || data.founded > currentYear) {
            errors.push('founded must be a valid year');
        }
    }
    if (!data.coach || typeof data.coach !== 'string' || data.coach.trim() === '' ){
        errors.push('coach is required');
    }
    if (!data.shortDescription || typeof data.shortDescription !== 'string' || data.shortDescription.trim() === '' ){
        errors.push('shortDescription is required');
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim() === '' ){
        errors.push('description is required');
    }
    const logoPattern =  /^\/logos\/.+$/;
    if (data.logo !== undefined && (typeof data.logo !== 'string' || !logoPattern.test(data.logo))) {
        errors.push('logo must be a valid logo path');
    }
    const imagePattern = /^\/images\/.+$/;
    if (data.image !== undefined && (typeof data.image !== 'string' || !imagePattern.test(data.image))) {
        errors.push('image must be a valid image path');
    }
    if (!data.category || typeof data.category !== 'string' || data.category.trim() === '' ){
        errors.push('category is required');
    }
    if (data.titles === undefined || !Number.isInteger(data.titles)) {
        errors.push('titles must be a number');
    } else if (data.titles < 0) {
        errors.push('titles cannot be negative');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
    
}
module.exports = { validateTeam };