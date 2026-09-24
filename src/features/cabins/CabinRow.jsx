import styled from "styled-components";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";

import { formatCurrency } from "../../utils/helpers";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Modal from "../../ui/Modal";
import Table from "@src/ui/Table";
import CreateCabinForm from "./CreateCabinForm";
import { useCreateCabin } from "./useCreateCabin";
import { useDeleteCabin } from "./useDeleteCabin";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

const Actions = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`;

export default function CabinRow({ cabin }) {
  // Mutations used by the row actions.
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { createCabin } = useCreateCabin();

  // Extract the values displayed in the row and used by the actions.
  const {
    id,
    name,
    maxCapacity,
    regularPrice,
    discount,
    description,
    image,
  } = cabin;

  // Create a copy using the current cabin's data.
  function handleDuplicate() {
    createCabin({
      newCabin: {
        name: `Copy of ${name}`,
        maxCapacity,
        regularPrice,
        discount,
        description,
        image,
      },
    });
  }

  // Pass the cabin id and confirmation options to the delete mutation.
  function handleDelete(options) {
    deleteCabin(id, options);
  }

  // Render the cabin details, row actions, and their modal windows.
  return (
    <Modal>
      <Table.Row role="row">
        <Img src={image} alt={name} />
        <Cabin>{name}</Cabin>
        <div>Fits in up to {maxCapacity}</div>
        <Price>${formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>${formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <Actions>
          {/* Open the edit form for this cabin. */}
          <Modal.Open opens="edit-cabin">
            <button aria-label={`Edit ${name}`}>
              <HiPencil />
            </button>
          </Modal.Open>
          {/* Duplicate the cabin immediately. */}
          <button
            onClick={handleDuplicate}
            aria-label={`Duplicate ${name}`}
          >
            <HiSquare2Stack />
          </button>
          {/* Open the confirmation modal before deleting. */}
          <Modal.Open opens="delete-cabin">
            <button
              disabled={isDeleting}
              aria-label={`Delete ${name}`}
            >
              <HiTrash />
            </button>
          </Modal.Open>
        </Actions>
      </Table.Row>
      {/* Edit modal receives the selected cabin as form default values. */}
      <Modal.Window name="edit-cabin">
        <CreateCabinForm cabinToEdit={cabin} />
      </Modal.Window>
      {/* Delete modal performs the mutation only after confirmation. */}
      <Modal.Window name="delete-cabin">
        <ConfirmDelete
          resource="cabin"
          onConfirm={handleDelete}
          disabled={isDeleting}
        />
      </Modal.Window>
    </Modal>
  );
}
