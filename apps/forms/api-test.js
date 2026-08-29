// API Test Script to debug the endpoint
async function testAPI() {
  const requestBody = {
    result: 15,
    evaluation: "Test evaluation",
    disability: "Test disability",
    surveyType: "Parents",
  };

  console.log("Testing API with data:", requestBody);

  try {
    const response = await fetch(
      "http://virilan362-001-site1.rtempurl.com/api/SurveyResult/Save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response body:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("Success! API Response:", result);
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error(
        "Network Error: Could be CORS, network connectivity, or server down"
      );
    } else if (error.message.includes("HTTP")) {
      console.error("Server Error: Check API endpoint and request format");
    }
  }
}

// Run the test
testAPI();
