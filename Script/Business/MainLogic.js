"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataType;
(function (DataType) {
    DataType[DataType["Email"] = 0] = "Email";
    DataType[DataType["Mobile"] = 1] = "Mobile";
    DataType[DataType["Required"] = 2] = "Required";
})(DataType || (DataType = {}));
var JsValidator = (function () {
    function JsValidator(errors) {
        if (errors === void 0) { errors = []; }
        this.Errors = [];
        this.getErrorType = function (error) {
            switch (error.toLowerCase()) {
                case 'email': return DataType.Email;
                case 'mobile': return DataType.Mobile;
            }
        };
        /**
         * set the error definition
         *
         *
         * @memberOf JsValidator
         */
        this.setErrorDef = function (error) {
            this.Errors.forEach(function (item, index) {
                if (item.Type == error.Type) {
                    this.Errors.splice(index, 1);
                    return;
                }
            });
            this.Errors.push(error);
        };
        /**
         * get Error Message
         *
         * @private
         *
         * @memberOf JsValidator
         */
        this.getErrorMsg = function (errorType) {
            var ErrorMessage = null;
            this.Errors.array.forEach(function (item) {
                if (item.Type == errorType) {
                    ErrorMessage = item.ErrorMsg;
                }
            });
            if (ErrorMessage == null) {
                return this.getDefaultErrorMsg(errorType);
            }
            return ErrorMessage;
        };
        /**
         * get Default Error Message
         *
         * @private
         *
         * @memberOf JsValidator
         */
        this.getDefaultErrorMsg = function (errorType) {
            var Msg;
            switch (errorType) {
                case DataType.Required:
                    Msg = "Required Field";
                    break;
                case DataType.Email:
                    Msg = "Invalid Email";
                    break;
                case DataType.Email:
                    Msg = "Invalid Mobile";
                    break;
            }
            return Msg;
        };
       
    }
    /**
     * validate the value
     *
     * @param {any} value
     * @param {boolean} [isReq=true]
     * @param {Error} [error]
     * @returns
     *
     * @memberOf JsValidator
     */
    JsValidator.prototype.validate = function (value, isReq, error) {
        if (isReq === void 0) { isReq = true; }
        if (isReq) {
            return {
                Error: true, Message: this.getErrorMsg(DataType.Required)
            };
        }
        if (error != null) {
            this.isValid(value, this.getErrorType(error));
        }
    };
    JsValidator.prototype.isValid = function (value, type) {
        var ErrorOccured, That = this;
        this.Errors.forEach(function (item) {
            if (type = item.Type) {
                ErrorOccured = That.validateData(value, item);
            }
        });
        if (ErrorOccured == null) {
            ErrorOccured = That.validateData(value, { Type: type });
        }
        return ErrorOccured;
    };
    JsValidator.prototype.validateData = function (value, error) {
        if (error.Regex) {
            return error.Regex.test;
        }
        else if (error.Code) {
            return error.Code();
        }
        else {
            switch (error.Type) {
                case DataType.Email:
                    error.Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    break;
                case DataType.Mobile:
                    error.Regex = /^[789]\d{9}$/;
                    break;
            }
            return error.Regex.test;
        }
    };
    return JsValidator;
}());
exports.JsValidator = JsValidator;
//# sourceMappingURL=MainLogic.js.map