import styled from "styled-components";


import { useForm } from "react-hook-form";
import { useCreateCabin} from "./useCreateCabin"
import { useEditCabin } from "./useEditCabin"

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";


const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit
  const isEditSession = Boolean(editId)
  const { register, handleSubmit, formState, reset, getValues } = useForm({
    defaultValues: isEditSession ? editValues : { }
  });
  const { errors } = formState;
 



  // Create cabin
  const { isCreating, createCabin } = useCreateCabin();

  // Edit Cabin
  const { isEditing, editCabins } = useEditCabin()
  
  const isWorking = isCreating || isEditing


  const onSubmit = (data) => {
    const image =
      typeof data.image === "string"
        ? data.image
        : data.image?.[0] ?? cabinToEdit.image;
    if (isEditSession) { 

     editCabins({
      newCabin: {
      ...data , image
       }, id: editId
     }, {
      onSuccess: (data) => {
        reset(data);
        onCloseModal?.();
      },
     });
      return;
     }
    createCabin({ newCabin: { ...data, image } }, {
      onSuccess: (data) => {
        reset(data);
        onCloseModal?.();
      },
    });
    
  };

  function onError(errors) { 
    console.log(errors)
  }

  return (
    <Form type="modal" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin name">
        
        <Input
          disabled={ isWorking}
          type="text"
          id="name"
          {...register("name", { required: "Cabin name is required" })}
        />
        {errors?.name && <Error>{errors.name.message}</Error>}
      </FormRow>

      <FormRow label="Maximum Capacity">
       
        <Input
          type="number"
          min={ 1}
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "Max capacity is required",
            min: {
                value:1,
            message:"Capacity should be at least 1"
            }
          })}
        />
        {errors.maxCapacity && <Error>{errors.maxCapacity.message}</Error>}
      </FormRow>

      <FormRow label="Regular Price">
        
        <Input
          type="number"
          id="regularPrice"
          min={ 0}
          {...register("regularPrice", {
            required: "Regular price is required",
            min: {
              value: 1,
              message:"Price must be higher than 100$"
            }
            
          })}
        />
        {errors.regularPrice && <Error>{errors.regularPrice.message}</Error>}
      </FormRow>

      <FormRow label="Discount">
       
        <Input
          disabled={ isWorking}
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "Discount is required",
            validate: (value) =>
              value <= getValues().regularPrice || "Discount should be less than regular price"
          }
          )}
        />
      </FormRow>

      <FormRow label="Description for website">
       
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description")}
        />
      </FormRow>

      <FormRow label="Cabin photo">
      
        <FileInput id="image" accept="image/*" type="file" 
          {...register("image", {
              required: isEditSession ? false :  "This Field is required"
            }
          )}
         />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="button" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit Cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
