import React, {useRef, useState, useEffect} from "react";
import Button from "./Button";
import './imageUpload.css'

const ImageUpload = props => {
/* The pickImageHandler should be triggered whenever we click 'PICK IMAGE' button and in this handler, want to open this built in file picker so that we utilize this input component which is invisible, but which if we could click it would open up a file picker.
So therefore to simulate a click on this, we have to get access to this input element and then just
call its click method and to get access we can use a reference not use to store some value which survives re render cycles, but instead to store a value which does survive re render cycles, but which most importantly establishes a connection to a DOM element. 
We basically used useRef() so that we do not need to show the ugly default file picker element, but instead we are using our custom Button and clicking that will actually click the file picker input element on the background. To have access to that click() method of the file picker element, we need to create a reference which survives rerender cycles of the component
So filePickerRef is used as a refence for pickImageHandler and to make input reference, just write ref = {filePickerRef} in input element.*/
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)
    const filePickRef = useRef()

    //Generate a preview whenever receives a new file. So we need to update our file state
    useEffect(() =>{
        if(!file){
            return;
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
//This doesn't work with a callback or returns promise Instead, before we call read as data URL on the fileReader, we have to register and execute onload(). Whenever the file reader loads a new file or is done parsing, this function will execute once this reading of the file here is done.
    }, [file])

    const pickedHandler = event => {
    //Get 'files' attribute that holds user selected files for a file picker
    let extractedFile;
    let fileIsValid = isValid
    if(event.target.files && event.target.files.length === 1){
        //Extract file and set as state
        extractedFile = event.target.files[0];
        setFile(extractedFile)
        setIsValid(true)
        fileIsValid = true
    }
    else{
        setIsValid(false)
        fileIsValid = false
    }
    //Forward the file input data to the surrounding component where we used 'imageUpload' component 
    //If we directly forward isValid, it would forward initial value only, not the updatedOne, so used another variable
    props.onInput(props.id, extractedFile, fileIsValid)
    }

    const pickImageHandler = () => {
    //This current() method exists on this DOM node and it will open up that file picker. So we utilize the input element without seeing it.    
    filePickRef.current.click()
    }
    return (
        <div className="form-control">
            {/*accept is default attribute we can add to inputs of type 'file' */}
            <input id={props.id}  ref={filePickRef} style={{display: 'none'}} type="file" accept=".jpg,.png,.jpeg" onChange={pickedHandler}/>
        {/* For image preview and positioning file picker later */}
        <div className={`image-upload ${props.center && 'center'}`}>
            <div className="image-upload__preview" >
                {previewUrl && <img src={previewUrl} alt="Preview" />}
                {!previewUrl && <p>Please pick an image</p>}
            </div>
            <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
        </div>
        {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}

export default ImageUpload