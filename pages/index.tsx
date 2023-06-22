import { useState, ChangeEvent, useEffect } from 'react';
import QRCode from 'qrcode.react';
import styles from '../styles/Home.module.css'
type Location = {
  label: string;
  value: string;
};

const locations: Location[] = [
  { label: 'Pool', value: 'pool-uuid' },
  { label: 'Gym', value: 'gym-uuid' },
  { label: 'Theater', value: 'theater-uuid' },
  { label: 'Meeting Room', value: 'meeting-room-uuid' },
];

const fetchData = async (place:string) => {
  try {
    const response = await fetch('http://localhost:4001/occupants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locale: place}),
    });
    const data = await response.json();
    const occupants = data.occupants;
    return occupants
  } catch (error) {
    console.error('Error:', error);
  }
};
export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [guests,setGuest] = useState<Number>(0)
  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const location = locations.find((loc) => loc.value === event.target.value);
    if (location) {
      setSelectedLocation(location);
    }
  };
  useEffect(() => {
    setGuest(0)
    const interval = setInterval(() => {
      fetchData(selectedLocation.value).then((result:number)=> setGuest(result))
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedLocation.value,]);
  return (
    <div className={styles.main}>
      <h1>Room</h1>
      <select value={selectedLocation.value} onChange={handleLocationChange}>
        {locations.map((location) => (
          <option key={location.value} value={location.value}>
            {location.label}
          </option>
        ))}
      </select>
      <QRCode value={selectedLocation.value} />
      <q>{guests} at {selectedLocation.label}</q>
    </div>
  );
}