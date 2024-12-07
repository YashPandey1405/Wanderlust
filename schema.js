// The Joy of Backend (JOI) lies in the power to build the structural backbone of an application, handling data management, business logic, and client-server communication.
// In backend development, you work behind the scenes to ensure data flows seamlessly from databases to users.
// It’s about crafting efficient APIs, managing databases, and ensuring that servers run reliably and securely.
// Mastering backend tools like Node.js, Express.js, and databases such as MongoDB and MySQL unlocks a world of possibilities, allowing developers to build scalable, high-performance applications.
// The backend provides the joy of seeing a well-designed system come to life—optimized, organized, and ready to handle any user request.
// For developers, each task, from handling user authentication to setting up RESTful APIs, contributes to making powerful and dynamic applications that deliver on performance and functionality.

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
