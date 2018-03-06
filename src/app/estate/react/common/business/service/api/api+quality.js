import { requestJSON } from "../../../base/api+base"

// 获取质量单据
const api_qualityInspection_all = 'quality/{deptId}/qualityInspection/all'; // GET size=35&page=0&qcState=
//public static final String[] CLASSIFY_NAMES = {"全部","待提交",  "待整改",      "待复查",    "已检查",    "已复查",  "已延迟",  "已验收"};
//public static final String[] CLASSIFY_STATES = {"",   "staged",  "unrectified","unreviewed","inspected","reviewed","delayed","accepted"};

    // /**
    //  * 获取质检清单
    //  */
    // @GET("quality/{deptId}/qualityInspection/all")
    // Observable<QualityCheckListBean> getQualityCheckList(@Path("deptId") long deptId, @Query("qcState") String qcState, @Query("page") int page, @Query("size") int size, @Query("sort") String[] sort, @Header("cookie") String cookie);

    // /**
    //  * 根据质检项目 获取质检清单
    //  */
    // @GET("quality/{deptId}/qualityInspection/all")
    // Observable<QualityCheckListBean> getQualityCheckList(@Path("deptId") long deptId, @Query("qcState") String qcState, @Query("page") int page, @Query("size") int size, @Query("sort") String[] sort,@Query("qualityCheckpointId")long qualityCheckpointId,@Query("qualityCheckpointName")String qualityCheckpointName, @Header("cookie") String cookie);

    // /**
    //  * 获取检查单详情
    //  */
    // @GET("quality/{deptId}/qualityInspection/{fileId}/detail")
    // Observable<QualityCheckListDetailBean> getQualityCheckListDetail(@Path("deptId") long deptId, @Path("fileId") long id, @Header("cookie") String cookie);
    // /**
    //  * 获取检查单详情
    //  */
    // @GET("quality/{deptId}/qualityInspection/{fileId}/detail")
    // Call<ResponseBody> getQualityCheckListDetail2(@Path("deptId") long deptId, @Path("fileId") long id, @Header("cookie") String cookie);

    // /**
    //  * 获取检查单详情
    //  */
    // @GET("quality/{deptId}/qualityInspection/all/qcState/summary")
    // Observable<List<ClassifyNum>> getStatusNum(@Path("deptId") long deptId, @Header("cookie") String cookie);

    // /**
    //  * 获取检查单详情  根据质检项目
    //  */
    // @GET("quality/{deptId}/qualityInspection/all/qcState/summary")
    // Observable<List<ClassifyNum>> getStatusNum(@Path("deptId") long deptId,@Query("qualityCheckpointId")long qualityCheckpointId,@Query("qualityCheckpointName")String qualityCheckpointName, @Header("cookie") String cookie);



export async function getQualityInspectionAll(projectId,page, size) {
    let api = "/quality/"+projectId+"/qualityInspection/all";
    return requestJSON(api + '?sort=updateTime,desc&page=' + page + '&size=' + size, {
        method: 'GET',
    });
}
