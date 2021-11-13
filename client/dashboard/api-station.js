const create = async (station) => {

    try {
      let response = await fetch('/ocpp/chargerPoints', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(station),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const list = async () => {
    try {
      let response = await fetch('/ocpp/chargerPoints', {
        method: 'GET',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const update = async (params) => {
    const {charger_box_id, _id} = params
    try {
      let response = await fetch('/ocpp/chargerPoints/' + _id, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({charger_box_id: charger_box_id}),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const remove = async (id) => {
    try {
      let response = await fetch('/ocpp/chargerPoints/'+ id, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  export { create , list, remove, update};