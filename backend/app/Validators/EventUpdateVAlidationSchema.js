import Event from "../Models/EventModel.js";

export  const eventUpdateValidationSchema={
    title: {
        in: ['body'],
        exists: {
            errorMessage: 'title is required'
        },
        notEmpty: {
            errorMessage: 'title cannot be empty'
        },
        isLength:{
            options:{min:3,max:25},
            errorMessage:"Title should be between 3 to 25 characters"
        },
        trim:true,
        
    },
    description:{
        in : ["body"],
        exists:{
            errorMessage:"description field is required"
        },
        notEmpty:{
            errorMessage:"description cannot be empty"
        },
        isLength:{
            options:{min:3},
            errorMessage:" should be atleast 3  characters"
        },
        trim:true,
    },
    posterImage: {
        in: ["body"],
        exists: {
          errorMessage: "Poster image field is required"
        },
        notEmpty: {
          errorMessage: "Poster image URL cannot be empty"
        },
        isURL: {
          errorMessage: "Poster image must be a valid URL"
        },
        trim: true
      },
      location: {
        in: ["body"],
        exists: {
          errorMessage: "Location field is required"
        },
        notEmpty: {
          errorMessage: "Location cannot be empty"
        },
        isLength: {
          options: { min: 3 },
          errorMessage: "Location must be at least 3 characters long"
        },
        trim: true
      },
      date: {
        in: ["body"],
        exists: {
          errorMessage: "Date field is required"
        },
        isISO8601: {
          errorMessage: "Date must be a valid ISO 8601 date"
        },
        custom: {
          options: (value) => {
            const eventDate = new Date(value);
            return eventDate > new Date();
          },
          errorMessage: "Event date must be in the future"
        }
      },
      time: {
        in: ["body"],
        exists: {
          errorMessage: "Time field is required"
        },
        notEmpty: {
          errorMessage: "Time cannot be empty"
        },
        matches: {
          options: [/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i],
          errorMessage: "Time must be in the format hh:mm AM/PM"
        },
        trim: true
      },
      pricePerSeat: {
        in: ["body"],
        exists: {
          errorMessage: "Price per seat is required"
        },
        isFloat: {
          options: { min: 0 },
          errorMessage: "Price must be a positive number"
        }
      },
      totalSeats: {
        in: ["body"],
        exists: {
          errorMessage: "Total seats field is required"
        },
        isInt: {
          options: { min: 1 },
          errorMessage: "Total seats must be at least 1"
        }
      },
      bookedSeats: {
        in: ["body"],
        optional: true,
        isArray: {
          errorMessage: "Booked seats must be an array"
        }
      },
      averageRating: {
        in: ["body"],
        optional: true,
        isFloat: {
          options: { min: 0, max: 5 },
          errorMessage: "Average rating must be between 0 and 5"
        }
      },
      numReviews: {
        in: ["body"],
        optional: true,
        isInt: {
          options: { min: 0 },
          errorMessage: "Number of reviews cannot be negative"
        }
      }

      

}