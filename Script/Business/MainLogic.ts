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
    protected isValid = function (value, type): boolean {
        var ErrorOccured: boolean, That = this;
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

    private validateData = function (value, error: IError, isDefined = false): boolean {

        var That = this, ErrorOccured = false, ExecuteDefault = function () {
            switch (error.Type) {
                case DataType.Number:
                    That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                    return isNaN(value);
                case DataType.Email:
                    That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                    var Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return Regex.test(value);
                case DataType.Mobile:
                    That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                    var Regex = /^[789]\d{9}$/;
                    return Regex.test(value);
                case DataType.Url:
                    That.ErrMsg = That.getDefaultErrorMsg(error.Type);
                    var Regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                    return Regex.test(value);
            }
        };
        if (!isDefined) {
            ErrorOccured = ExecuteDefault();
        }
        else {
            //if regex exist
            if (error.Regex) {
                this.ErrMsg = this.getDefaultErrorMsg(error.Type);
                ErrorOccured = error.Regex.test(value);
            }
            //if code exist
            if (!ErrorOccured && error.Code) {
                this.ErrMsg = this.getDefaultErrorMsg(error.Type);
                ErrorOccured = error.Code();
            }
            //MinMax Check
            if (!ErrorOccured) {
                if (error.MinMax) {  //MinMax
                    this.ErrMsg = error.MinMax.Msg == undefined ? "The length of Value should be between " + error.MinMax.Min.toString() + "and " + error.MinMax.Max.toString() : error.MinMax.Msg;
                    ErrorOccured = (value.length >= error.MinMax.Min) && (value.length <= error.MinMax.Max);
                }
                else if (error.Min) { //Min
                    this.ErrMsg = "Minimum length should be " + error.Min.Length.toString();
                    ErrorOccured = value.length >= error.Min.Length;
                }
                else if (error.Max) { //Min
                    this.ErrMsg = "Maximum length should be " + error.Max.Length.toString();
                    ErrorOccured = value.length <= error.Max.Length;
                }
            }
            // Equal To check
            if (!ErrorOccured && error.Equal) {
                this.ErrMsg = error.Equal.Msg == undefined ? "invalid value" : error.Equal.Msg;
                ErrorOccured = value === error.Equal.To;
            }

            //Default Execution
            if (!ErrorOccured) {
                ErrorOccured = ExecuteDefault();
            }
        }
        return ErrorOccured;
    }
}

class JsValidator extends Helper {
    ErrMsg: string;
    
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
    validate = function (value, error: IError): boolean {
        this.ErrMsg = "";
        if ((error == undefined || error.IsRequired == undefined ? true : error.IsRequired) && value.length == 0) {
            this.ErrMsg = this.getErrorMsg(DataType.Required);
            return true;
        }
        if (!this.Error && error != null) {
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

