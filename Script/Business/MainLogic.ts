enum DataType {
    Email,
    Mobile,
    Required,
    Url
}

interface IError {
    ErrorMsg: string,
    Type: DataType,
    Code: Function,
    Regex: any,
    MinLength: number,
    MaxLength: number
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
        this.Errors.array.forEach(function (item) {
            if (item.Type == errorType) {
                ErrorMessage = item.ErrorMsg;
            }
        });
        if (ErrorMessage == null) {
            return this.getDefaultErrorMsg(errorType);
        }
        return ErrorMessage;
    }

    private getDefaultErrorMsg = function (errorType) {
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
    }

    /**
     * check whether value is valid or not
     * 
     * @protected
     * 
     * @memberOf Helper
     */
    protected isValid = function (value, type) {
        var ErrorOccured: boolean, That = this;
        this.Errors.forEach(function (item) {
            if (type = item.Type) {
                ErrorOccured = That.validateData(value, item);
            }
        });
        if (ErrorOccured == null) {
            ErrorOccured = That.validateData(value, { Type: type });
        }
        return ErrorOccured;
    }

    private validateData = function (value: string, error: IError) {
        if (error.Regex) {
            return error.Regex.test;
        }
        else if (error.Code) {
            return error.Code();
        }
        else if (error.MinLength) {
            return value.length >= error.MinLength;
        }
        else if (error.MaxLength) {
            return value.length <= error.MaxLength;
        }
        else {
            switch (error.Type) {
                case DataType.Email:
                    error.Regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    break;
                case DataType.Mobile:
                    error.Regex = /^[789]\d{9}$/;
                    break;
                case DataType.Url:
                    error.Regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                    break;
            }
            return error.Regex.test;
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
    validate = function (value, error: IError, isReq = true): IOutResult {
        if (isReq) {
            return <IOutResult>{
                Error: true, Message: this.getErrorMsg(DataType.Required)
            };
        }
        if (error != null) {
            return <IOutResult>{
                Error: this.isValid(value, this.getErrorType(error)), Message: this.getErrorMsg(error.Type)
            };
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

