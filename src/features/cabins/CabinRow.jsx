import styled from 'styled-components';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';

import { formatCurrency } from '../../utils/helpers';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Modal from '../../ui/Modal';
import Menus from '../../ui/Menus';
import Table from '@src/ui/Table';
import CreateCabinForm from './CreateCabinForm';
import { useCreateCabin } from './useCreateCabin';
import { useDeleteCabin } from './useDeleteCabin';

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
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';s
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

export default function CabinRow({ cabin }) {
  // Mutations used by the row actions.
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { createCabin } = useCreateCabin();

  // Extract the values displayed in the row and used by the actions.
  const { id, name, maxCapacity, regularPrice, discount, description, image } =
    cabin;

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
    <Table.Row role="row">
      <Modal>
        <Img src={image} alt={name} />
        <Cabin>{name}</Cabin>
        <div>Fits in up to {maxCapacity}</div>
        <Price>${formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>${formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <Menus>
          <Menus.Menu>
            <Menus.Toggle id={id} />
            <Menus.List id={id}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
              >
                Duplicate
              </Menus.Button>
              <Modal.Open opens="delete-cabin">
                <Menus.Button icon={<HiTrash />} disabled={isDeleting}>
                  Delete
                </Menus.Button>
              </Modal.Open>
              <Modal.Open opens="edit-cabin">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>
        </Menus>
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

    </Table.Row>
  );
}
