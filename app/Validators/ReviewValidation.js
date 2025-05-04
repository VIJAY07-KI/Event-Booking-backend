export const reviewValidationSchema = {
    event: {
        in: ["body"],
        exists: {
          errorMessage: "Event ID is required"
        },
        isMongoId: {
          errorMessage: "Event ID must be a valid MongoDB ObjectId"
        }
      },
      user: {
        in: ["body"],
        exists: {
          errorMessage: "User ID is required"
        },
        isMongoId: {
          errorMessage: "User ID must be a valid MongoDB ObjectId"
        }
      },
      rating: {
        in: ["body"],
        exists: {
          errorMessage: "Rating is required"
        },
        isFloat: {
          options: { min: 0, max: 5 },
          errorMessage: "Rating must be a number between 0 and 5"
        }
      },
      comment: {
        in: ["body"],
        optional: true,
        isString: {
          errorMessage: "Comment must be a string"
        },
        trim: true,
        isLength: {
          options: { min: 3 },
          errorMessage: "Comment must be at least 3 characters long"
        }
      }

}