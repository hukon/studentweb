'use server';

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  visaType: z.string().min(1, 'Please select a visa type'),
  message: z.string().min(10, 'Message is too short')
});

export async function submitConsultation(prevState: any, formData: FormData) {
  try {
    const rawData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      visaType: formData.get('visaType'),
      message: formData.get('message')
    };

    const validatedData = formSchema.parse(rawData);

    // Initialise Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase URL or Key missing. Simulating success for testing.');
        await new Promise(r => setTimeout(r, 1000));
        return { success: true };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('consultations')
      .insert([
        {
          full_name: validatedData.fullName,
          email: validatedData.email,
          phone: validatedData.phone,
          visa_type: validatedData.visaType,
          message: validatedData.message,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, error: 'Failed to submit the form. Please try again later.' };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, validationErrors: error.flatten().fieldErrors };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
