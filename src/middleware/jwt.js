import dotenv from 'dotenv/config'
import jwt from 'jsonwebtoken'


export const isAdminLogedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Save decoded token to request for use in other routes
            req.adminId = decoded.adminId;

            next();
        });
    } catch (err) {
        return res.status(401).json({ message: "Authentication failed", error: err.message });
    }
}


export const isUserLogedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError(403, "Token not found!!!")
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                throw new ApiError(401, "Unauthorized User")
            }

            req.userId = decoded.userId

            next()

        })
    } catch (error) {
        throw new ApiError(401, error.message)
    }
}



export const isSellerLogedIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError(403, "Token not found!!!")
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                throw new ApiError(401, "Unauthorized User")
            }

            req.sellerId = decoded.sellerId

            next()

        })
    } catch (error) {
        throw new ApiError(401, error.message)
    }
}