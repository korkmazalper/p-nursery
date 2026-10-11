
package main.java.com.example.sharingapp;

import android.content.Context;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;

/**
 * ContactList manages the list of contacts
 */
public class ContactList {
    private ArrayList<Contact> contacts;
    private String FILENAME = "contacts.sav";

    public ContactList() {
        contacts = new ArrayList<Contact>();
    }

    public void setContacts(ArrayList<Contact> contact_list) {
        this.contacts = contact_list;
    }

    public ArrayList<Contact> getContacts() {
        return contacts;
    }

    public ArrayList<String> getAllUsernames() {
        ArrayList<String> usernames = new ArrayList<String>();
        for (Contact c : contacts) {
            usernames.add(c.getUsername());
        }
        return usernames;
    }

    public void addContact(Contact contact) {
        contacts.add(contact);
    }

    public void deleteContact(Contact contact) {
        contacts.remove(contact);
    }

    public Contact getContact(int index) {
        return contacts.get(index);
    }

    public int getSize() {
        return contacts.size();
    }

    public int getIndex(Contact contact) {
        int pos = 0;
        for (Contact c : contacts) {
            if (contact.getId().equals(c.getId())) {
                return pos;
            }
            pos++;
        }
        return -1;
    }

    public boolean hasContact(Contact contact) {
        for (Contact c : contacts) {
            if (contact.getId().equals(c.getId())) {
                return true;
            }
        }
        return false;
    }

    public Contact getContactByUsername(String username) {
        for (Contact c : contacts) {
            if (c.getUsername().equals(username)) {
                return c;
            }
        }
        return null;
    }

    public boolean isUsernameAvailable(String username) {
        for (Contact c : contacts) {
            if (c.getUsername().equals(username)) {
                return false;
            }
        }
        return true;
    }

    public void loadContacts(Context context) {
        try {
            FileInputStream fis = context.openFileInput(FILENAME);
            InputStreamReader isr = new InputStreamReader(fis);
            Gson gson = new Gson();
            Type listType = new TypeToken<ArrayList<Contact>>() {
            }.getType();
            contacts = gson.fromJson(isr, listType);
            fis.close();
        } catch (Exception e) {
            contacts = new ArrayList<Contact>();
        }
    }

    public void saveContacts(Context context) {
        try {
            FileOutputStream fos = context.openFileOutput(FILENAME, Context.MODE_PRIVATE);
            OutputStreamWriter osw = new OutputStreamWriter(fos);
            Gson gson = new Gson();
            gson.toJson(contacts, osw);
            osw.flush();
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
