
import Booking from "../Models/BookingModel.js"
export const bookingValidationSchema={
    user: {
        in: ['body'],
        exists: {
            errorMessage: 'user is required'
        },
        notEmpty: {
            errorMessage: 'user cannot be empty'
        },
        isMongoId: {
            errorMessage: 'user should be a mongodb id'
        }
    },
    event: {
        in: ['body'],
        exists: {
            errorMessage: 'event is required'
        },
        notEmpty: {
            errorMessage: 'event cannot be empty'
        },
        isMongoId: {
            errorMessage: 'event should be a mongodb id'
        }
    },
    seats: {
        in: ["body"],
        exists: {
          errorMessage: "Seats field is required"
        },
        isArray: {
          errorMessage: "Seats must be an array"
        },
        notEmpty: {
          errorMessage: "Seats array cannot be empty"
        }
      },
      totalAmount: {
        in: ["body"],
        exists: {
          errorMessage: "Total amount is required"
        },
        isFloat: {
          options: { min: 0 },
          errorMessage: "Total amount must be a positive number"
        }
      },
      paymentStatus: {
        in: ["body"],
        optional: true,
        isIn: {
          options: [['pending', 'Success']],
          errorMessage: "Payment status must be either 'pending' or 'Success'"
        }
      }

}