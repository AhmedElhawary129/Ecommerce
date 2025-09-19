export enum UserRoles {
    user = "user",
    admin = "admin",
    superAdmin = "superAdmin"
}

//----------------------------------------------------------------------------------------------------------------

export enum UserGender {
    male = "male",
    female = "female",
    other = "other"
}

//----------------------------------------------------------------------------------------------------------------

export enum OTPTypes {
    emailConfirmation = "emailConfirmation",
    resetPassword = "resetPassword"
}

//----------------------------------------------------------------------------------------------------------------

export enum PaymentMethodTypes {
    cash = "cash",
    card = "card"
}

//----------------------------------------------------------------------------------------------------------------

export enum OrderStatusTypes {
    pending = "pending",
    placed = "placed",
    onWay = "onWay",
    delivered = "delivered",
    cancelled = "cancelled",
    rejected = "rejected",
    refunded = "refunded",
    paid = "paid"
}