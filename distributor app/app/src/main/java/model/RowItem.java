package model;

import org.json.JSONException;
import org.json.JSONObject;

public class RowItem {
	private String Id;
	private String date;
	private String cardserial;
	//private String staffid;
    private String synced;
	String _reference;
    private int TypeHeader;
    private int TypeItem;
	
	public RowItem(String _id, String date_added,String cardserial, String _synced) {
		this.Id = _id;
		this.date=date_added;
		this.cardserial=cardserial;
        this.synced = _synced;
		//this.staffid = staffid;
	}

    public RowItem(String _id, String date_added, String _reference, String _version, String cardserial, String _synced, int _typeHeader, int _typeItem) {
        this.Id = _id;
        this.date=date_added;
        this.cardserial=cardserial;
        this.synced = _synced;
        this.TypeHeader=_typeHeader;
        this.TypeItem=_typeItem;
    }
	  public RowItem() {
		// TODO Auto-generated constructor stub
	}
	public void setId(String id) {
		this.Id=id;
	}
	public String getId() {
		return Id;
	}

	public void setRef(String ref) {
		this._reference=ref;
	}
	public String getRef() {
		return _reference;
	}

	public void setDate(String date) {
		this.date=date;
	}
	public String getDate() {
		return date;
	}

    public void setSynced(String synced) {
        this.synced = synced;
    }
   /* public void setStaffid(String staffid) {
        this.staffid = staffid;
    }*/
   /* public String getStaffid(){
		return staffid;
	}*/

    public String getSynced() {
        return synced;
    }

    /*public JSONObject getJSONObject() {
	        JSONObject obj = new JSONObject();
	        try {
	            obj.put("StaffCardId", cardserial);
	            obj.put("Date", date);
	        } catch (JSONException e) {
	           e.getMessage();
	        }
	        return obj;
	    }*/

    public void setTypeHeader(int typeHeader) {
        TypeHeader = typeHeader;
    }

    public int getTypeHeader() {
        return TypeHeader;
    }

    public void setTypeItem(int typeItem) {
        TypeItem = typeItem;
    }

    public int getTypeItem() {
        return TypeItem;
    }

    @Override
	public String toString() {
		return Id;
	}
	public String getCardSerial() {
		// TODO Auto-generated method stub
		return cardserial;
	}	
	public void setCardserial(String cardserial) {
		// TODO Auto-generated method stub
		this.cardserial= cardserial;
	}	
}
