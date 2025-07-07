import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SkillData {
  name: string;
  proficiency: number;
  daysUntilDecay?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { responses } = await req.json()

    console.log('Creating skill passport for user:', user.id)
    console.log('Responses received:', Object.keys(responses).length)

    // TODO: Implement actual skill extraction and proficiency calculation
    // This is a placeholder implementation that creates sample skill data
    // In a real implementation, you would:
    // 1. Analyze the responses using AI/ML models
    // 2. Extract skills mentioned in the responses
    // 3. Calculate proficiency levels based on experience descriptions
    // 4. Determine decay timelines based on skill types and usage patterns

    // Sample skill extraction (replace with actual implementation)
    const skills: SkillData[] = [
      { name: "JavaScript", proficiency: 4, daysUntilDecay: 120 },
      { name: "React", proficiency: 4, daysUntilDecay: 90 },
      { name: "TypeScript", proficiency: 3, daysUntilDecay: 150 },
      { name: "Project Management", proficiency: 3, daysUntilDecay: 180 },
      { name: "Leadership", proficiency: 2, daysUntilDecay: 365 },
    ]

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name, business_unit')
      .eq('user_id', user.id)
      .single()

    // Create passport JSON
    const passportJson = {
      profile: {
        name: profile?.full_name || 'Unknown',
        businessUnit: profile?.business_unit || 'Not specified',
        completedAt: new Date().toISOString(),
      },
      skills,
      metadata: {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        totalResponses: Object.keys(responses).length,
      }
    }

    // Save or update the skill passport
    const { error: passportError } = await supabaseClient
      .from('skill_passports')
      .upsert({
        user_id: user.id,
        passport_json: passportJson,
      })

    if (passportError) {
      console.error('Error saving passport:', passportError)
      throw passportError
    }

    console.log('Skill passport created successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Skill passport created successfully',
        skillsCount: skills.length 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in create-passport function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})