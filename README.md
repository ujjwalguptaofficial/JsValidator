# JsValidator

# How to use 
1. download the file
2. find the script under output folder
3. include it in your html file

# Doc

## Check for null
```
var Validator=new JsValidator();
var Name=document.getElementById('txtName');
if(Validator.isInvalid(Name.value)) // return true if error otherwise false
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

```
### Note :-  you can use "isValid" Function to check valid value.

## Check for null with custom message

```
var Validator=new JsValidator();
var Name=document.getElementById('txtName');
if(Validator.isInvalid(Name.value,{Is:{Required:true,Msg:"This is required value"}})) 
{
    alert(Validator.ErrMsg); 
}

```

## Check for different datatype -  email, url, mobile, number
```
var Validator=new JsValidator();
var Price=document.getElementById('txtPrice');
//check number
if(Validator.isInvalid(Price.value,{ Type:'number'})) // return true if error otherwise false
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//for email,url, mobile : replace type with the value like email,url,mobile - e.g -

if(Validator.isInvalid(Price.value,{ Type:'email'})) // return true if error otherwise false
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//Note :- the mobile no check is for indian no only. So in the case if something is not working for you - 
// you can override the validation logic or create your own.

```
### Note :- currently we support following datatype -
1. Email
2. Url
3. Mobile
4. Number

## OverRide validation logic or add your own

### Using Constructor
```
var Validator=new JsValidator(
    [
        {
            Type:'email',
            Regex:/^((ht|f)tp(s?)\:\/\/|~/|/)?([\w]+:\w+@)?([a-zA-Z]{1}([\w\-]+\.)+([\w]{2,5}))(:[\d]{1,5})?((/?\w+/)+|/?)(\w+\.[\w]{3,4})?((\?\w+=\w+)?(&\w+=\w+)*)?/,
            ErrorMsg:'Enter valid email',
            Is:{Required:true,Msg:"This field is required"}
        },
        {
            Type:'Mobile',
            Code:function()
            {
                if(isNan(value))
                {
                    return true;
                }
                else if(value.toString().length<10)
                {
                    return true;
                }
                return false;
            },
            ErrorMsg:'Enter valid number',
            Is:{Required:false}
        },
        {
            Type:'UsMobile', // this is for adding your own logic
            Code:function(value)
            {
                //any code but return true or false
            }
        }
    ]
);

// you can define both constraints like Code and Regex - if regex will return false then Code will be executed.

```
### Using 'setErrorDef' - you can define error at any time using this method

```
Validator.setErrorDef({
            Type:'email',
            Regex:/^((ht|f)tp(s?)\:\/\/|~/|/)?([\w]+:\w+@)?([a-zA-Z]{1}([\w\-]+\.)+([\w]{2,5}))(:[\d]{1,5})?((/?\w+/)+|/?)(\w+\.[\w]{3,4})?((\?\w+=\w+)?(&\w+=\w+)*)?/,
            ErrorMsg:'Enter valid email',
            Is:{Required:false}
        });

```

## Check for Min or Max length
```
var Validator=new JsValidator();
var Price=document.getElementById('txtPrice');
//Min length
// this will check for both number and value of min length 3 - Msg is optional
if(Validator.isInvalid(Price.value,{ Type:'number',Min:{Length:3, Msg:"Min length should be 3"}})) 
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//Max length
// this will check for both number and value of min length 3 - add Msg if you want the custom message
if(Validator.isInvalid(Price.value,{ Type:'number',Max:{Length:3}})) 
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

//Min and MAx both - add Msg in MinMax to get the custom message
if(Validator.isInvalid(Price.value,{ Type:'number',MinMax:{Min:3,Max:5}}))
{
    alert(Validator.ErrMsg); // Validator.ErrMsg will contains the current Error Message
}

```
## Check for Equal to

```
var Validator=new JsValidator(),
Pwd=document.getElementById('txtPwd'),
CPwd=document.getElementById('txtCPwd');

if(Validator.isInvalid(CPwd.value,{Equal:{ To:Pwd.value,Msg:"Confirm Pwd does not matches with Pwd" } })
{
   alert(Validator.ErrMsg);
}

```

