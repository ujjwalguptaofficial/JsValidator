enum DataType {
    Email,
    Mobile,
    Required,
    Url,
    Number
}
interface IMinMax {
    Length: number,
    Msg: string
}

interface IError {
    ErrorMsg: string,
    Type: DataType,
    Code: Function,
    Regex: any,
    Equal: { To: any, Msg: string },
    IsRequired: boolean,
    Min: IMinMax,
    Max: IMinMax,
    MinMax: {
        Min: number,
        Max: number,
        Msg: string
    }
}

interface IOutResult {
    Error: boolean,
    Message: string
}

class Helper {
    Errors: Array<IError> = [];
    protected getErrorType = function (error) {
        switch (error.toLowerCase()) {
            case 'email': return DataType.Email;
            case 'mobile': return DataType.Mobile;
            case 'url': return DataType.Url;
            case 'number': return DataType.Number;
        }
    }

    /**
     * return the error message
     * 
     * @protected
     * 
     * @memberOf Helper
     */
    protected getErrorMsg = function (errorType) {
        var ErrorMessage = null;
        this.Errors.forEach(function (item) {
            if (item.Type == errorType) {
                ErrorMessage = item.ErrorMsg;
            }
        });
        if (ErrorMessage == null) {
            return this.getDefaultErrorMsg(errorType);
        }
        return ErrorMessage;
    }

    private getDefaultErrorMsg = function (type: DataType) {
        var Msg;
        switch (type) {
            case DataType.Number:
                Msg = "Value should contains only digits"; break;
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
    }

    /**
     * check whether value is valid or not
     * 
     * @protected
     * 
     * @memberOf Helper
     */
    protected isValid = function (value, type): IOutResult {
        var ErrorOccured: IOutResult, That = this;
        this.Errors.forEach(function (item) {
            if (type = item.Type) {
                ErrorOccured = That.validateData(value, item);
            }
        });
        if (ErrorOccured == null) {
            ErrorOccured = That.validateData(value, { Type: type }, true);
        }
        return ErrorOccured;
    }

    private validateData = function (value, error: IError, isDefined = false): IOutResult {
        var That: Helper = this, Result = <IOutResult>{},
            ExecuteDefault = function () {
                switch (error.Type) {
                    case DataType.Number:
                        return <IOutResult>{ Error: !isNaN(value), Message: That.getDefaultErrorMsg(error.Type) }
                    case DataType.Email:
                        var Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return <IOutResult>{ Error: Regex.test(value), Message: "Invalid Email" }
                    case DataType.Mobile:
                        var Regex = /^[789]\d{9}$/;
                        return <IOutResult>{ Error: Regex.test(value), Message: That.getDefaultErrorMsg(error.Type) }
                    case DataType.Url:
                        var Regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                        return <IOutResult>{ Error: Regex.test(value), Message: That.getDefaultErrorMsg(error.Type) }
                }
            };
        if (!isDefined) {
            return ExecuteDefault();
        }
        else {
            //if regex exist
            if (error.Regex) {
                return <IOutResult>{ Error: error.Regex.test(value), Message: That.getDefaultErrorMsg(error.Type) }
            }
            //if code exist
            if (error.Code) {
                return <IOutResult>{ Error: error.Code(), Message: That.getDefaultErrorMsg(error.Type) }
            }
            //MinMax Check
            if (error.MinMax) {
                return <IOutResult>{
                    Error: (value.length >= error.MinMax.Min) && (value.length <= error.MinMax.Max),
                    Message: error.MinMax.Msg == undefined ? "The length of Value should be between " + error.MinMax.Min.toString() + "and " + error.MinMax.Max.toString() : error.MinMax.Msg
                }
            }
            //Min check
            if (error.Min) {
                return <IOutResult>{
                    Error: value.length >= error.Min.Length,
                    Message: "Minimum length should be " + error.Min.Length.toString()
                }
            }
            // Max check
            if (error.Max) {
                return <IOutResult>{
                    Error: value.length <= error.Max.Length,
                    Message: "Maximum length should be " + error.Max.Length.toString()
                }
            }
            // Equal To check
            if (error.Equal) {
                return <IOutResult>{
                    Error: value === error.Equal.To,
                    Message: error.Equal.Msg == undefined ? "invalid value" : error.Equal.Msg
                }
            }

            //Default Execution
            return ExecuteDefault();
        }

    }
}

class JsValidator extends Helper {
    constructor(errors: Array<IError> = []) {
        super();
        var That = this;
        errors.forEach(function (item) {
            item.Type = That.getErrorType(item.Type);
            That.Errors.push(item);
        });
    }

    /**
     * validate the value
     * 
     * 
     * @memberOf JsValidator
     */
    validate = function (value, error: IError): IOutResult {
        (error == undefined || error.IsRequired == undefined) ? true : error.IsRequired;
        if ((error == undefined || error.IsRequired) && value.length == 0) {
            return <IOutResult>{
                Error: true, Message: this.getErrorMsg(DataType.Required)
            };
        }
        if (error != null) {
            return this.isValid(value, this.getErrorType(error.Type));
        }
    };

    /**
     * set the error definition
     * 
     * 
     * @memberOf JsValidator
     */
    setErrorDef = function (error) {
        this.Errors.forEach(function (item, index) {
            if (item.Type == error.Type) {
                this.Errors.splice(index, 1);
                return;
            }
        });
        this.Errors.push(error);
    }

}

