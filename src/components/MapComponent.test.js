import React from 'react';
import { render, screen } from '@testing-library/react';
import MapComponent from './MapComponent';
import axios from 'axios';

 jest.mock('axios');

 const mockStations = [
    {"id": "1", "ws_name": "Cohuna North", "site": "Cohuna Solar Farm", "portfolio": "Enel Green Power","state": "VIC", "latitude": "-35.882762", "longitude": "144.217208"},
    {"id": "2", "ws_name": "Bungala 1 West", "site": "Bungala 1 Solar Farm", "portfolio": "Enel Green Power","state": "SA", "latitude": "-32.430536", "longitude": "137.846245"}
];
const mockMeasruements = [
    {"id":12,"timestamp":"2023-08-29T06:55:00","airtInst":17.54,"ghiInst":46.0,"wsAvg":null,"wdAvg":null,"avgAm2":null,"avgAirTemp":null,"avgWm2":null},
    {"id":24,"timestamp":"2023-08-29T03:00:00","airtInst":null,"ghiInst":null,"wsAvg":null,"wdAvg":null,"avgAm2":null,"avgAirTemp":19.93,"avgWm2":702.4}
];

describe('MapComponentTests', () => {

    it('should render markers on the map correctly', async() => {
        axios.get(`${process.env.REACT_APP_WS_API_SERVER}/ws/all`).mockResolvedValueOnce({data: mockStations});
        axios.get(`${process.env.REACT_APP_WS_API_SERVER}/ws/1`).mockResolvedValueOnce({data:mockMeasruements });
        render(<MapComponent/>);
        await waitFor(() => {
            // Check if markers are being rendered
            const markers = screen.getAllByTestId('marker');
            expect(markers).toHaveLength(mockStations.length);
            markers.forEach((item, index) => {
                expect(item).toHaveAttribute('position', {latitude: mockStations[index].latitude, longitude: mockStations[index].longitude})
            });
            mockStations.forEach((item,index) => {
                expect(markers[index].textContent).toContain(`<p>Portfolio: ${item.portfolio}</p>`);
            });
        });
    });
});