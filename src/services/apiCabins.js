import { supabase, supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error('Error fetching cabins:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error('Error fetching cabins:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function createCabins(cabinData) {
  const hasImagePath = cabinData.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${cabinData.image.name}`.replaceAll(
    '/',
    '',
  );
  const imagePath = hasImagePath
    ? cabinData.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // Create the Cabin
  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...cabinData, image: imagePath }])
    .select()
    .single();

  if (error) {
    console.error('Error fetching cabins:', error);
    throw new Error(error.message);
  }

  // 2. Upload the image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, cabinData.image);

  // 3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data[0].id);
    console.error(storageError);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created',
    );
  }

  return data;
}
export async function editCabins(cabinData, id) {
  const hasImagePath = cabinData.image?.startsWith?.(supabaseUrl);
  const imageName = hasImagePath
    ? null
    : `${Math.random()}-${cabinData.image.name}`.replaceAll('/', '');
  const imagePath = hasImagePath
    ? cabinData.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  let savedCabin;

  if (id) {
    const { data, error } = await supabase
      .from('cabins')
      .update({ ...cabinData, image: imagePath })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating cabin:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error(
        `Cabin ${id} was not updated. Check the Supabase UPDATE policy for cabins.`,
      );
    }

    savedCabin = data;
  } else {
    const { data, error } = await supabase
      .from('cabins')
      .insert([{ ...cabinData, image: imagePath }])
      .select()
      .single();

    if (error) {
      console.error('Error creating cabin:', error);
      throw new Error(error.message);
    }

    savedCabin = data;
  }

  // 2. Upload the image
  if (hasImagePath) return savedCabin;

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, cabinData.image);

  // 3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    if (!id) await supabase.from('cabins').delete().eq('id', savedCabin.id);
    console.error(storageError);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not saved',
    );
  }

  return savedCabin;
}
