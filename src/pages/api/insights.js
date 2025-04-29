
// This file would be converted to a serverless function in Next.js
// It handles requests to the OpenAI API for data analysis

/**
 * API Route: /api/insights
 * 
 * This endpoint processes data analysis requests:
 * 1. Receives CSV data and user query
 * 2. Sends the data to OpenAI's API with specific instructions
 * 3. Processes the AI response into structured formats (text, table, chart)
 * 4. Returns the formatted insights to the client
 * 
 * Environment variables required:
 * - OPENAI_API_KEY: Your OpenAI API key
 */

// Import OpenAI API
// import { Configuration, OpenAIApi } from "openai"; 

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query, data } = req.body;

        if (!query || !data || !data.headers || !data.rows) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Get OpenAI API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.error('Missing OpenAI API key');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Prepare data sample (limit to prevent token overflow)
        const dataSample = data.rows.slice(0, 20);
        
        // Create a summary of the data structure
        const dataStructure = data.headers.map(header => {
            // Try to determine the data type from the first few rows
            const values = dataSample.map(row => row[header]);
            const sampleValues = values.slice(0, 5).join(', ');
            const isNumeric = values.every(val => !isNaN(parseFloat(val)) && val !== '');
            
            return {
                header,
                dataType: isNumeric ? 'numeric' : 'text',
                sampleValues
            };
        });

        // Format the prompt for OpenAI
        const prompt = `
            You are a data analyst expert. Analyze the following CSV data and answer the user's question.
            
            Data Structure:
            ${JSON.stringify(dataStructure, null, 2)}
            
            Data Sample (first 20 rows):
            ${JSON.stringify(dataSample, null, 2)}
            
            User Question: ${query}
            
            Provide a comprehensive analysis in JSON format with these three sections:
            1. "insight": A detailed text explanation answering the question
            2. "tableData": If relevant, provide structured data for a table with {"headers": [...], "rows": [[...], ...]}
            3. "chartData": If relevant, suggest data for a chart with [{"name": "Label1", "value": 42}, ...]
            
            Ensure all three properties are present in your JSON, even if empty.
        `;

        // In a real implementation, this would call the OpenAI API
        // Since we're not making the actual API call here, we'll simulate a response
        
        // Simulated AI response - in production, replace with actual API call
        const simulatedResponse = {
            insight: `Analysis for your query: "${query}"\n\nBased on the provided data, I found several interesting insights. The data shows trends in [relevant field] with significant variations between [categories]. The average value is approximately [X], with a standard deviation of [Y]. There appears to be a correlation between [field A] and [field B].`,
            tableData: {
                headers: ["Category", "Count", "Average", "Min", "Max"],
                rows: [
                    ["Category A", "42", "15.7", "5", "30"],
                    ["Category B", "28", "22.3", "10", "45"],
                    ["Category C", "35", "18.9", "8", "36"]
                ]
            },
            chartData: [
                { name: "Category A", value: 42 },
                { name: "Category B", value: 28 },
                { name: "Category C", value: 35 }
            ]
        };

        /* 
        // This is how the actual OpenAI API call would be implemented:
        
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // or gpt-4 for more complex analysis
            messages: [
                { role: "system", content: "You are a helpful data analyst who provides insights in JSON format." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });
        
        const responseText = completion.data.choices[0].message.content;
        let aiResponse;
        try {
            // Parse the JSON response
            aiResponse = JSON.parse(responseText);
        } catch (error) {
            console.error('Error parsing OpenAI response:', error);
            aiResponse = {
                insight: responseText,
                tableData: null,
                chartData: null
            };
        }
        */

        // Return the response
        return res.status(200).json(simulatedResponse);
        
    } catch (error) {
        console.error('Error processing insights request:', error);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}
