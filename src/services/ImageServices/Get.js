const getImage = async () => {
  try {
      const response = await fetch(`https://image-hosting-worker.maulanazulkifar.workers.dev/`);
      if (!response.ok) {
          throw new Error('Failed to fetch users');
      }
      return await response.json();
  } catch (e) {
      console.log(e);
  }
}

export default getImage;