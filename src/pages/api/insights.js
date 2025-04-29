
// This file handles requests to the OpenAI API for data analysis

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
            return res.status(500).json({ error: 'Server configuration error: Missing API key' });
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
        const systemPrompt = `
            You are a data analyst expert. Analyze the following CSV data and answer the user's question.
            
            Data Structure:
            ${JSON.stringify(dataStructure, null, 2)}
            
            Data Sample (first 20 rows):
            ${JSON.stringify(dataSample, null, 2)}
        `;

        // Make the actual OpenAI API call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-4o",  // Using a capable model for data analysis
                messages: [
                    { 
                        role: "system", 
                        content: systemPrompt 
                    },
                    { 
                        role: "user", 
                        content: `Question about the data: ${query}
                        
                        Provide a comprehensive analysis in JSON format with these three sections:
                        1. "insight": A detailed text explanation answering the question
                        2. "tableData": If relevant, provide structured data for a table with {"headers": [...], "rows": [[...], ...]}
                        3. "chartData": If relevant, suggest data for a chart with [{"name": "Label1", "value": 42}, ...]
                        
                        Ensure all three properties are present in your JSON, even if empty.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            return res.status(response.status).json({ 
                error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` 
            });
        }

        const openaiResponse = await response.json();
        let aiResponse;
        
        try {
            // Try to parse the JSON response
            const responseText = openaiResponse.choices[0].message.content;
            aiResponse = JSON.parse(responseText);
            
            // Ensure the response has the required structure
            aiResponse = {
                insight: aiResponse.insight || "No insights were generated.",
                tableData: aiResponse.tableData || null,
                chartData: aiResponse.chartData || null
            };
            
        } catch (error) {
            console.error('Error parsing OpenAI response:', error);
            // If parsing fails, create a structured response from the raw text
            aiResponse = {
                insight: openaiResponse.choices[0].message.content,
                tableData: null,
                chartData: null
            };
        }

        // Return the response
        return res.status(200).json(aiResponse);
        
    } catch (error) {
        console.error('Error processing insights request:', error);
        return res.status(500).json({ error: `Failed to process request: ${error.message}` });
    }
}
