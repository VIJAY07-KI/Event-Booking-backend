export const paymentValidationSchema = {
    user: {
        in: ["body"],
        exists: {
          errorMessage: "User ID is required"
        },
        isMongoId: {
          errorMessage: "User ID must be a valid MongoDB ObjectId"
        }
      },
      booking: {
        in: ["body"],
        exists: {
          errorMessage: "Booking ID is required"
        },
        isMongoId: {
          errorMessage: "Booking ID must be a valid MongoDB ObjectId"
        }
      },
      paymentId: {
        in: ["body"],
        exists: {
          errorMessage: "Payment ID is required"
        },
        notEmpty: {
          errorMessage: "Payment ID cannot be empty"
        },
        isString: {
          errorMessage: "Payment ID must be a string"
        },
        trim: true
      },
      status: {
        in: ["body"],
        optional: true,
        isIn: {
          options: [['success', 'failed', 'pending']],
          errorMessage: "Status must be one of 'success', 'failed', or 'pending'"
        }
      },
      amount: {
        in: ["body"],
        exists: {
          errorMessage: "Amount is required"
        },
        isFloat: {
          options: { min: 0 },
          errorMessage: "Amount must be a positive number"
        }
      },
      paymentMethod: {
        in: ["body"],
        exists: {
          errorMessage: "Payment method is required"
        },
        notEmpty: {
          errorMessage: "Payment method cannot be empty"
        },
        isString: {
          errorMessage: "Payment method must be a string"
        },
        trim: true
      }

}