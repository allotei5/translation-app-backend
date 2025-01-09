
import { authentication, random } from "../helpers";
import { createUser, getUserByEmail } from "../db/user";
import express from "express";
import Joi from "joi";

const UserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { error, value } = UserSchema.validate(req.body);

    if (error) {
      return res.status(422).json({
        message: "Validation error",
        details: error.details,
      });
    }

    const { firstName, lastName, email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = random();
    const user = await createUser({
      email,
      firstName,
      lastName,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    })

    return res.status(201).json(user).end();
    
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }  
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "Email and password required",
      });
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
      const expectedHash = authentication(user.authentication.salt, password)
      if (user.authentication.password !== expectedHash) {
          return res.sendStatus(403).json({
              message: "Invalid email or password"
          })
      }

      const salt = random();
      user.authentication.sessionToken = authentication(salt, user._id.toString());
      await user.save();
      res.cookie('translation-app-backend', user.authentication.sessionToken, {domain: 'localhost', path: '/'})
      return res.status(200).json(user).end()
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); 
  }  
}
  