import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { singleLockers, partnerLockers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const isAdmin = (locals: any) => {
  const session = locals.session;
  return session && session.user && session.user.role === 'admin';
};

export async function GET({ locals }: RequestEvent) {
  try {
    if (!isAdmin(locals)) {
      return json({ error: 'Unauthorized access' }, { status: 403 });
    }
  
    const singleLockerRequests = await db
      .select()
      .from(singleLockers)
      .where(eq(singleLockers.available, false));
      
    const partnerLockerRequests = await db
      .select()
      .from(partnerLockers)
      .where(eq(partnerLockers.available, false));
    
    return json({
      single: singleLockerRequests,
      partner: partnerLockerRequests
    });
  } catch (error) {
    console.error('Error fetching admin locker requests:', error);
    return json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function PUT({ request, locals }:  RequestEvent) {
  try {
    if (!isAdmin(locals)) {
      return json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const data = await request.json();
    const { id, type, approve } = data;
    
    if (!id || !type || approve === undefined) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (type === 'single') {
      await db
        .update(singleLockers)
        .set({ available: approve })
        .where(eq(singleLockers.id, id));
    } 
    else if (type === 'partner') {
      await db
        .update(partnerLockers)
        .set({ available: approve })
        .where(eq(partnerLockers.id, id));
    } 
    else {
      return json({ error: 'Invalid locker type' }, { status: 400 });
    }
    
    return json({ 
      success: true, 
      message: `Locker request ${approve ? 'approved' : 'denied'}` 
    });
  } catch (error) {
    console.error('Error approving/denying locker request:', error);
    return json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE({ request, locals }: RequestEvent) {
  try {
    if (!isAdmin(locals)) {
      return json({ error: 'Unauthorized access' }, { status: 403 });
    }
    
    const data = await request.json();
    const { id, type } = data;
    
    if (!id || !type) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (type === 'single') {
      await db
        .delete(singleLockers)
        .where(eq(singleLockers.id, id));
    } 
    else if (type === 'partner') {
      await db
        .delete(partnerLockers)
        .where(eq(partnerLockers.id, id));
    } 
    else {
      return json({ error: 'Invalid locker type' }, { status: 400 });
    }
    
    return json({ 
      success: true, 
      message: 'Locker request deleted' 
    });
  } catch (error) {
    console.error('Error deleting locker request:', error);
    return json({ error: 'Failed to delete request' }, { status: 500 });
  }
}