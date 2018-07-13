var query={
    /////////////////////////////////////////////////////////////////////////////////////////////////user
    
        insertMem:"insert into heroku_fba3ee939ab66f8.user_info (user_id, user_pass,user_name, user_age, user_sex) values (?,?,?,?,?);",
        insertRank:"insert into heroku_fba3ee939ab66f8.user_rank(user_rank,user_degree,user_status,user_date,user_id) values('M','MEMBER',1,now(),?);",
        selectId:"select count(user_id) as cnt from heroku_fba3ee939ab66f8.user_info where user_id=?;",
        checkIdPass:"select * from heroku_fba3ee939ab66f8.user_info where user_id=?;",
        deleteMem:"update heroku_fba3ee939ab66f8.user_rank set user_status=0 where user_id=?;",
        checkStatus:"select user_status from heroku_fba3ee939ab66f8.user_rank where user_id=?;",
        modifyMem:"update heroku_fba3ee939ab66f8.user_info set user_pass=?,user_name=?,user_age=?,user_sex=? where user_id=?",
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////// community
    
        updateClickView:"update community set community_count=community_count+1 where community_idx = ?;",
        selectAllBoard:"SELECT community.*,(SELECT COUNT(*) AS cnt FROM community_comment WHERE community.community_idx =" + 
                        "community_comment.community_idx) as commentTotalCnt FROM community ORDER BY community_idx DESC;",
        selectBoard:"select * from heroku_fba3ee939ab66f8.community where community_idx = ?;",
        selectBoardComment:"select * from heroku_fba3ee939ab66f8.community_comment where community_idx =?;",
        insertCommunity:"insert into heroku_fba3ee939ab66f8.community (community_title, community_content, community_name) values (?,?,?);",
        deleteBoard:"delete from heroku_fba3ee939ab66f8.community where community_idx=?;",
        insertCommunityComment:"insert into heroku_fba3ee939ab66f8.community_comment (bcom_id, bcom_content, community_idx) values (?,?,?);",
        deleteBoardComment:"delete from heroku_fba3ee939ab66f8.community_comment where bcom_idx=?;",
        modifyBoard: "update heroku_fba3ee939ab66f8.community set community_title=?,community_content=? where community_idx=?",
    
    //////////////////////////////////////////////////////////////////////////////////////////////////gallery
        
        insertgall: "insert into heroku_fba3ee939ab66f8.gallery (gall_path, gall_title) value (?,?);",
        delgall: "delete from gallery where gall_idx=?",
        viewgall: "SELECT * FROM heroku_fba3ee939ab66f8.gallery ORDER BY gall_idx DESC",
        selectgall: "SELECT * FROM heroku_fba3ee939ab66f8.gallery where gall_idx = ?",
        reg_comment: "INSERT INTO heroku_fba3ee939ab66f8.gallery_comment (gcom_id, gcom_content, gall_idx) values(?,?,?)",
        selsectcom: "SELECT * FROM heroku_fba3ee939ab66f8.gallery_comment where gall_idx = ?",
        delgcom : "DELETE FROM gallery_comment where gcom_idx=?"
    }
    
    module.exports=query;