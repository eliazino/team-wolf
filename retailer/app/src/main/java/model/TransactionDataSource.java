package model;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import java.util.ArrayList;



public class TransactionDataSource {

    private static final String ATTENDANCE_TABLE = "ProvisioninTb1";
	private static final String COLUMN_ID = "Id";
	private static final String COLUMN_CARDID = "cardserial";
	//private static final String COLUMN_STAFFID = "staffid";
	private static final String COLUMN_DATE = "datetime";
    private static final String COLUMN_SYNCED = "sync";

	private static final String COLUMN_REF = "ref";

	private static final String[] allcolumns = { COLUMN_ID, COLUMN_CARDID, COLUMN_DATE,COLUMN_SYNCED, COLUMN_REF};

	SQLiteOpenHelper dbHelper;
	SQLiteDatabase database;
	Context context;
	private static final String LOGTAG = "ProvisioninDb"; // log tag

	public TransactionDataSource(Context context) {

		dbHelper = new TransactionsDbOpenHelper(context);
		this.context = context;
	}

	public void open() {

		database = dbHelper.getWritableDatabase();
		Log.e(LOGTAG, "Database opened");
	}

	public void close() {
		dbHelper.close();
		Log.e(LOGTAG, "Database closed");

	}

	public Long Create(RowItem item) {

		ContentValues values = new ContentValues();
		values.put(COLUMN_CARDID, item.getCardSerial());
		values.put(COLUMN_DATE, item.getDate());
        values.put(COLUMN_SYNCED, item.getSynced());
		values.put(COLUMN_ID, item.getId());
		values.put(COLUMN_REF, item.getRef());
		//values.put(COLUMN_STAFFID, item.getStaffid());
		//values.put(COLUMN_CHARGEDFEE, item.getchargefee());
		long insertid = database.insert(ATTENDANCE_TABLE, null, values);
		return insertid;

	}

	public ArrayList<RowItem> getAll(int id) {

		//String selection = "SELECT date FROM TransactionDb WHERE transaction_type =?",new String[] {type};
		  String WHERE = "Id > ?";
		String selectQuery ="SELECT * FROM " + ATTENDANCE_TABLE +" WHERE "+COLUMN_ID+" > "+id +" ORDER BY Id DESC";
		Cursor cursor=database.query(ATTENDANCE_TABLE, allcolumns, WHERE , new String[] {String.valueOf(id)}, null, null, null);
		//Cursor cursor = database.query(TRANSACTION_TABLE, allcolumns, null, null, null, null, null);
		
		ArrayList<RowItem> transactions=new ArrayList<RowItem>();
		if (cursor != null) {
			
			while (cursor.moveToNext()) {
				RowItem item = new RowItem();
				item.setId(cursor.getString(0));
				item.setCardserial(cursor.getString(1));
				/*long d = Long.parseLong(cursor.getString(2));
				Date currentDate = new Date(d);
				DateFormat df = new SimpleDateFormat("dd:MM:yy:HH:mm:ss");
				//DateFormat df =
				item.setDate(df.format(currentDate));*/
				item.setDate(cursor.getString(2));
				item.setSynced(cursor.getString(3));
				item.setRef(cursor.getString(4));
				//item.setStaffid(cursor.getString(5));
                item.setTypeHeader(1);
                item.setTypeItem(1);
				transactions.add(item);
			}
		}
		return transactions;
	}

    public ArrayList<RowItem> getTransactions() {
        //String selection = "SELECT date FROM TransactionDb WHERE transaction_type =?",new String[] {type};
        String selectQuery ="SELECT * FROM " + ATTENDANCE_TABLE + " ORDER BY Id DESC";
        Cursor cursor=database.rawQuery(selectQuery, new String[] {});

        ArrayList<RowItem> transactions=new ArrayList<RowItem>();
        if (cursor != null) {

            while (cursor.moveToNext()) {
                RowItem item = new RowItem();
                item.setId(cursor.getString(0));
                item.setCardserial(cursor.getString(1));
                item.setDate(cursor.getString(2));
				item.setSynced(cursor.getString(3));
				item.setRef(cursor.getString(4));
				//item.setStaffid(cursor.getString(5));
                item.setTypeHeader(1);
                item.setTypeItem(1);
                transactions.add(item);
            }
        }
        return transactions;
    }
	


    public ArrayList<RowItem> getAttendanceBySynced(String synced) {
        synced = "%" + synced + "%";
        //String selectQuery ="SELECT cardid FROM " + ATTENDANCE_TABLE +" WHERE date  = ?";
        String selectQuery = " select * from "+ATTENDANCE_TABLE+" where sync like  '"
                + synced
                + "' ORDER BY "+COLUMN_ID+" DESC";
        Cursor cursor=database.rawQuery(selectQuery,null);
        ArrayList<RowItem> transactions=new ArrayList<RowItem>();
        if (cursor != null) {

            while (cursor.moveToNext()) {
                RowItem item = new RowItem();
                item.setId(cursor.getString(0));
                item.setCardserial(cursor.getString(1));
				/*long d = Long.parseLong(cursor.getString(2));
				Date currentDate = new Date(d);
				//Date currentDate = new Date(cursor.getString(2).toString());
				DateFormat df = new SimpleDateFormat("dd:MM:yy:HH:mm:ss");
				//DateFormat df =
				item.setDate(df.format(currentDate));*/
				item.setDate(cursor.getString(2));
                item.setSynced(cursor.getString(3));
				item.setRef(cursor.getString(4));
				//item.setStaffid(cursor.getString(5));
                item.setTypeHeader(1);
                item.setTypeItem(1);
                transactions.add(item);
            }
        }
        return transactions;

    }

    public int getRowsCount() {
		Cursor cursion = database.query(ATTENDANCE_TABLE, allcolumns, null, null,
				null, null, null);
		int count = cursion.getCount();
		return count;

	}
	
	public void DeleteAllList() {
		database.execSQL("delete from "+ ATTENDANCE_TABLE);
		
	}

	public void DeleteTransactionList(String transactionRef) {
		database.execSQL("delete from "+ ATTENDANCE_TABLE+ " where "+ COLUMN_CARDID+"= "+ "'"+transactionRef+"'" );

	}
	
}
