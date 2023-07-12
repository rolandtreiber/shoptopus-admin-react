import PaymentTypes from "../../data/payment-methods.json";
import VisaLogo from "../../static/images/payment-types/visa.png";
import MastercardLogo from "../../static/images/payment-types/mastercard.png";
import AmericanExpressLogo from "../../static/images/payment-types/american-express.png";
import PayPalLogo from "../../static/images/payment-types/paypal.png";
import GooglePayLogo from "../../static/images/payment-types/google-pay.png";
import ApplePayLogo from "../../static/images/payment-types/apple-pay.png";
import AmazonPayLogo from "../../static/images/payment-types/amazon-pay.png";
import GenericLogo from "../../static/images/payment-types/generic.png";

const PaymentTypeLogo = ({type, brand}) => {
  const renderPaymentTypeLogo = (type, brand) => {
    switch (PaymentTypes[type]?.name) {
      case "Stripe":
        switch (brand) {
          case "visa":
            return <img alt="visa-logo" src={VisaLogo} width={"100%"}/>
          case "mastercard":
            return <img alt="mastercard-logo" src={MastercardLogo} width={"100%"}/>
          case "american express":
            return <img alt="american-express-logo" src={AmericanExpressLogo} width={"100%"}/>
          default:
            return <img alt="visa-logo" src={VisaLogo} width={"100%"}/>
        }
      case "PayPal":
        return <img alt="paypal-logo" src={PayPalLogo} width={"100%"}/>
      case "GooglePay":
        return <img alt="google-pay-logo" src={GooglePayLogo} width={"100%"}/>
      case "ApplePay":
        return <img alt="apple-pay-logo" src={ApplePayLogo} width={"100%"}/>
      case "AmazonPay":
        return <img alt="amazon-pay-logo" src={AmazonPayLogo} width={"100%"}/>
      default:
        return <img alt="generic-logo" src={GenericLogo} width={"100%"}/>
    }
  }

  return renderPaymentTypeLogo(type, brand)
}

export default PaymentTypeLogo