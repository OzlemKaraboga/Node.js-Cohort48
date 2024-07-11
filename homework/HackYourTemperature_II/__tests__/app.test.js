import app from "../app.js";
import supertest from "supertest";

const request = supertest(app);

describe("POST /weather", () => {
  it("should return an error if city name is not provided", async () => {
    const response = await request.post('/weather').send({});
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'City name is required');
  });

  it("should return an error if city name is too long", async () => {
    const city = "a".repeat(101);
    const response = await request.post('/weather').send({ cityName: city });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'City name is too long');
  });

  it("should return an error if city name is not a string", async () => {
    const response = await request.post('/weather').send({ cityName: 123 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'City name must be a string');
  });

  it("should return weather data for existing cities", async () => {
    const response = await request.post('/weather').send({ cityName: 'Istanbul' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('weatherText');
    expect(response.body.weatherText).toContain('Istanbul');
    expect(response.body.weatherText).toContain('The current temperature');
});

  it("should return 'City is not found!' for a non-existent city", async () => {
    const response = await request.post('/weather').send({ cityName: 'NonExistentCity' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('weatherText', 'City is not found!');
  });
});