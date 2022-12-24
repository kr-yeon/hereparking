interface GeoCodingProps {
  status: boolean;
  address?: string;
}

export default async function (
  latitude: number,
  longitude: number,
): Promise<GeoCodingProps> {
  try {
    const json = await (
      await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=&language=ko',
      )
    ).json();
    return {status: true, address: json.results[0].formatted_address};
  } catch (e) {
    return {status: false};
  }
}
