const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        image: Joi.string().allow(null, ''), // Allow string, null, or empty string for image
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0)
    })
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports = { reviewSchema };
module.exports = { listingSchema };