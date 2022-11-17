from typing import Dict
from mysite import models
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.template.loader import get_template
from django.db.models import Count,Q
from django.template.defaulttags import register
import os
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from . import views

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
media_dir = os.path.join(BASE_DIR, 'player_pictures/media/')

 
def poi_drafts(request,types=None):
    if 'username' in request.session:

        try:
            nickname = request.session['nickname']
        except:
            pass
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']


        
        poiList = models.Dublincore.objects.filter(rights=username, language=language,is_draft = True) 
        mpegCountList = models.Mpeg.objects.all().values("foreignkey").annotate(total=Count("foreignkey")).order_by("foreignkey")
        mediaMap =  dict()
        for tmp in mpegCountList:
            mediaMap[tmp["foreignkey"]] = tmp["total"]>0



        
        if types:
            return HttpResponseRedirect('/poi_drafts')


        template = get_template('drafts_poi.html')
        html = template.render(locals())
        return HttpResponse(html)
        

    else:
        return HttpResponseRedirect('/')




def deletePOIDraft(request, id=None):
    if id==None:
        return
    if request.method == 'DELETE':

        if 'username' in request.session:
            try:
                nickname = request.session['nickname']
            except:
                pass
            username = request.session['username']
            role = request.session['role']
            language = request.session['language']
    
            

            poi = models.Dublincore.objects.get(poi_id=id)
            mpeg = models.Mpeg.objects.filter(foreignkey=poi)
                    
            if mpeg:
                for m in mpeg:
                    if m.format == 1:
                        file_neme = (media_dir + m.picture_name)
                        try:
                            os.remove(file_neme)
                        except OSError:
                            pass
                    elif m.format == 2:
                        file_neme = (media_dir + 'audio/' + m.picture_name)
                        try:
                            os.remove(file_neme)
                        except OSError:
                            pass
                    elif m.format == 4:
                        file_neme = (media_dir + 'video/' + m.picture_name)
                        try:
                            os.remove(file_neme)
                        except OSError:
                            pass
                    elif m.format == 8:
                        file_neme = (media_dir + 'audio/' + m.picture_name)
                        try:
                            os.remove(file_neme)
                        except OSError:
                            pass
            poi.delete()
            views.delete_all_xoi_in_coi(id, "poi")
            return HttpResponse('')

    elif request.method == 'PUT':
        poi = models.Dublincore.objects.get(poi_id=id)
        poi.is_draft = False
        try:
            views.AutoIncrementSqlSave(poi, "[dbo].[dublincore]")
        except Exception as e:
            print("update failed",e)
        return HttpResponse('')
     
    return HttpResponseServerError('wrong method')



def loi_drafts(request,id=None):
    if 'username' in request.session:

        try:
            nickname = request.session['nickname']
        except:
            pass
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']

        
        if request.method=="GET":
            list = models.RoutePlanning.objects.filter(route_owner=username, language=language,is_draft = True)



            template = get_template('drafts_loi.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method=="DELETE":
            print("delete",id)
            if id!=None:
                loi = models.RoutePlanning.objects.get(route_id=id)
                loi.delete()
                views.delete_all_xoi_in_coi(id, "loi")
                
            template = get_template('drafts_loi.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method == 'PUT':
            loi = models.RoutePlanning.objects.get(route_id=id)
            loi.is_draft = False
        try:
            loi.save()
        except Exception as e:
            print("update failed",e)
        return HttpResponse('')
    else:
        return HttpResponseRedirect('/')




def aoi_drafts(request,id=None):
    if 'username' in request.session:

        try:
            nickname = request.session['nickname']
        except:
            pass
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']

        
        if request.method=="GET":
            list = models.Aoi.objects.filter(owner=username, language=language,is_draft= True)

            template = get_template('drafts_aoi.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method=="DELETE":
            if id!=None:
                aoi = models.Aoi.objects.get(aoi_id=id)
                aoi.delete()
                views.delete_all_xoi_in_coi(id, "aoi")
                
            template = get_template('drafts_loi.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method == 'PUT':
            aoi = models.Aoi.objects.get(aoi_id=id)
            aoi.is_draft = False
        try:
            aoi.save()
        except Exception as e:
            print("update failed",e)
        return HttpResponse('')
    else:
        return HttpResponseRedirect('/')

        
def soi_drafts(request,id=None):
    if 'username' in request.session:

        try:
            nickname = request.session['nickname']
        except:
            pass
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']

        
        if request.method=="GET":
            list = models.SoiStory.objects.filter(soi_user_name=username, language=language,is_draft = True)


            template = get_template('drafts_soi.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method=="DELETE":
            if id!=None:
                soi = models.SoiStory.objects.get(soi_id=id)
                soi.delete()
                views.delete_all_xoi_in_coi(id, "soi")
                
            template = get_template('drafts_soi.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method == 'PUT':
            soi = models.SoiStory.objects.get(soi_id=id)
            soi.is_draft = False
        try:
            soi.save()
        except Exception as e:
            print("update failed",e)
        return HttpResponse('')
    else:
        return HttpResponseRedirect('/')


    
def event_room_drafts(request,id=None, coi='deh'):
    if 'username' in request.session:

        try:
            nickname = request.session['nickname']
        except:
            pass
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']
        is_leader = request.session['is_leader']

        
        if request.method=="GET":
            user = models.UserProfile.objects.get(user_name=username)
            eventmember_list = models.EventsMember.objects.filter(user_id=user.user_id)
            templist = models.EventsMember.objects.filter(Q(user_id=user.user_id) & (Q(found_question = True)| Q(evaluate_question = True)| Q(enable_activity = True)))
            member_list = eventmember_list.values_list('event_id', flat=True)
            member_dict = dict()
            for m in templist:
                member_dict[m.event_id_id] = True
              
            event_list = models.Events.objects.filter(Event_id__in=member_list,coi_name=coi).order_by('Event_id')
            ids = event_list.values_list('Event_id', flat=True)
            game_list = models.EventSetting.objects.filter(event_id_id__in=ids,is_draft = True)
            template = get_template('drafts_event_room.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method=="DELETE":
            if id!=None:
                soi = models.SoiStory.objects.get(soi_id=id)
                soi.delete()
                views.delete_all_xoi_in_coi(id, "soi")
                
            template = get_template('drafts_event_room.html')
            html = template.render(locals())
            return HttpResponse(html)
        elif request.method == 'PUT':
            soi = models.SoiStory.objects.get(soi_id=id)
            soi.is_draft = False
        try:
            soi.save()
        except Exception as e:
            print("update failed",e)
        return HttpResponse('')
    else:
        return HttpResponseRedirect('/')
    
def poi_drafts_coi(request, coi=''):
     
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        template = get_template(coi + '/index.html')
        html = template.render(locals())
        return HttpResponse(html)

    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    try:
        user_obj = models.UserProfile.objects.filter(user_name=username)
    except ObjectDoesNotExist:
        template = get_template(coi + '/index.html')
        html = template.render(locals())
        return HttpResponse(html)

    if views.check_user_in_coi(user_obj, coi):
        coi_poi = views.FilterCoiPoint('poi', coi)
        coi_loi = views.FilterCoiPoint('loi', coi)
        coi_aoi = views.FilterCoiPoint('aoi', coi)
        coi_soi = views.FilterCoiPoint('soi', coi)

        user_poi = coi_poi.filter(rights=username, language=language,is_draft = True)
        user_loi = coi_loi.filter(route_owner=username, language=language,is_draft = True)
        user_aoi = coi_aoi.filter(owner=username, language=language,is_draft = True)
        user_soi = coi_soi.filter(soi_user_name=username, language=language,is_draft = True)

        export_poi_list = list(user_poi.values('poi_id', 'poi_title', 'subject', 'area_name_en', 'type1', 'period', 'year', 
        'keyword1', 'keyword2', 'keyword3', 'keyword4', 'poi_address', 'latitude', 'longitude',
        'poi_description_1', 'format', 'poi_source', 'creator', 'publisher', 'contributor', 'open', 'language'))
        for poi in export_poi_list:
            # print(poi)
            Pictures = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=1) 
            Audio = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=2)
            Video = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=4) 
            index = 1
            for p in Pictures:
                print('picture url:',p.picture_url)
                poi['picture'+str(index)] = p.picture_url
                index += 1
            for a in Audio:
                poi['audio'] = a.picture_url
                print('audio url:',a.picture_url)
            for v in Video:
                poi['video'] = v.picture_url
                print('video url:',v.picture_url)


        poi_list, loi_list, aoi_list, soi_list = [], [], [], []
        for poi in list(user_poi.values('poi_id', 'poi_title', 'open')):
            temp_poi = models.CoiPoint.objects.get(
                point_id=poi['poi_id'], coi_name=coi)
            poi['verification'] = temp_poi.verification
            poi['feedback_mes'] = temp_poi.feedback_mes
            try:
                poi['format'] = min(models.Mpeg.objects.filter(foreignkey=poi['poi_id']).values_list('format', flat=True))
            except:
                poi['format'] = 0
            poi_list.append(poi)

        for loi in list(user_loi.values('route_id', 'route_title', 'open')):
            temp_loi = models.CoiPoint.objects.get(
                point_id=loi['route_id'], coi_name=coi)
            loi['verification'] = temp_loi.verification
            loi['feedback_mes'] = temp_loi.feedback_mes
            loi_list.append(loi)

        for aoi in list(user_aoi.values('aoi_id', 'title', 'open')):
            temp_aoi = models.CoiPoint.objects.get(
                point_id=aoi['aoi_id'], coi_name=coi)
            aoi['verification'] = temp_aoi.verification
            aoi['feedback_mes'] = temp_aoi.feedback_mes
            aoi_list.append(aoi)

        for soi in list(user_soi.values('soi_id', 'soi_title', 'open')):
            temp_soi = models.CoiPoint.objects.get(
                point_id=soi['soi_id'], coi_name=coi)
            soi['verification'] = temp_soi.verification
            soi['feedback_mes'] = temp_soi.feedback_mes
            soi_list.append(soi)

        try:
            loipoi = models.Sequence.objects.filter(foreignkey__in=user_loi)
        except:
            loipoi = None
        try:
            aoipoi = models.AoiPois.objects.filter(aoi_id_fk__in=user_aoi)
        except:
            aoipoi = None
        try:
            soixoi = models.SoiStoryXoi.objects.filter(soi_id_fk__in=user_soi)
        except:
            soixoi = None     

        groups = models.Groups.objects.filter(language=language, coi_name=coi)
        group_list = models.GroupsMember.objects.filter(
            user_id=user_obj, foreignkey__in=groups)
        template = get_template(coi + '/list_point_draft.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        template = get_template(coi + '/index.html')
        html = template.render(locals())
        return HttpResponse(html)


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)



