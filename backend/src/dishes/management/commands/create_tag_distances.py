from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...models import Tag, TagDistances


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        #func1()
        #func2()
        #func3()
        print(get_last_parent(Tag.objects.get(id=2)))
        for tag in Tag.objects.all():
            for tag2 in Tag.objects.all():
                print(tag.title, tag2.title)
                print(TagDistances.objects.get(col=tag,
                                              row=tag2))


def func3():
    for tag1 in Tag.objects.all():
        for tag2 in Tag.objects.all():
            if (get_level(tag1) == 3) and (get_level(tag2) != 3):
                parent1 = get_last_parent(tag1)
                parent2 = get_last_parent(tag2)
                if (parent1 != parent2):
                    TagDistances.objects.create(col=tag1,
                                                row=tag2,
                                                distance=TagDistances.objects.get(col=parent1,
                                                                                  row=parent2).distance)




def func2():
    for tag1 in Tag.objects.all():
        for tag2 in Tag.objects.all():
            if get_level(tag1) != 3:
                parent1 = get_last_parent(tag1)
                parent2 = get_last_parent(tag2)
                if parent1 != parent2:
                    TagDistances.objects.create(col=tag1,
                                                row=tag2,
                                                distance=TagDistances.objects.get(col=parent1,
                                                                                  row=parent2).distance)


def get_last_parent(tag):
    if tag.parent is None:
        return tag
    if tag.parent.parent is None:
        return tag.parent
    return tag.parent.parent


def func1():
    levels = [[], [], []]
    TagDistances.objects.all().delete()
    for tag in Tag.objects.all():
        TagDistances.objects.create(col=tag,
                                    row=tag,
                                    distance=0)
        levels[get_level(tag) - 1].append((tag))
        if tag.parent is not None:
            TagDistances.objects.create(col=tag,
                                        row=tag.parent,
                                        distance=0)
            if tag.parent.parent is not None:
                TagDistances.objects.create(col=tag,
                                            row=tag.parent.parent,
                                            distance=0)

    for parent in levels[2]:
        children = parent.children.all()
        for parent2 in levels[2]:
            if parent != parent2:
                TagDistances.objects.create(col=parent,
                                            row=parent2,
                                            distance=3)

        if children != None:
            for child in children:
                TagDistances.objects.create(col=parent,
                                            row=child,
                                            distance=2)
                for child2 in children:
                    if child != child2:
                        TagDistances.objects.create(col=child,
                                                    row=child2,
                                                    distance=2)
                grandchild = child.children.all()
                if grandchild != None:
                    for grand in grandchild:
                        TagDistances.objects.create(col=parent,
                                                    row=grand,
                                                    distance=2)
                        TagDistances.objects.create(col=child,
                                                    row=grand,
                                                    distance=1)
                        for grand2 in grandchild:
                            if grand != grand2:
                                TagDistances.objects.create(col=grand,
                                                            row=grand2,
                                                            distance=1)


def get_level(tag):
    level = 0
    tag1 = tag
    while tag1 is not None:
        tag1 = tag1.parent
        print(tag1)
        level += 1
    return 4 - level


def create_tag_distances():
    for tag in Tag.objects.all():
        TagDistances.objects.create(col=tag, row=tag, distance=0)
        children = tag.children.all()
        for child in children:
            TagDistances.objects.create(col=child, row=tag, distance=0)


def create_specific_distances():
    level0 = Tag.objects.filter(title='All')
    level1 = Tag.objects.filter(parent_id='37')
    middle_east_cat = Tag.objects.filter(parent_id='22')
    eropean_cat = Tag.objects.filter(parent_id='36')
    general_cat = Tag.objects.filter(parent_id='19')
    american_cat = Tag.objects.filter(parent_id='5')
    asian_cats = Tag.objects.filter(parent_id='8')
    deserts = Tag.objects.filter(parent_id='14')
    greek_food = Tag.objects.filter(parent_id='23')
    italian_food = Tag.objects.filter(parent_id='1')
    japanease_food = Tag.objects.filter(parent_id='9')
    chainese_food = Tag.objects.filter(parent_id='10')

    # All with itsels:
    # TagDistances.objects.create(col=level0[0], row=level0[0], distance=0)
    # All to its children and reverse:
    for tag in level1:
        TagDistances.objects.create(col=tag, row=level0[0], distance=0) # 3
        TagDistances.objects.create(col=level0[0], row=tag, distance=3) # 0
    # distances between level 2 objects
    for tag1 in level1:
        for tag2 in level1:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=3)

    # middle east tags
    middle_east = Tag.objects.get(title='Middle East')
    # TagDistances.objects.create(col=middle_east, row=middle_east, distance=0)
    for tag in middle_east_cat:
        #TagDistances.objects.create(col=tag, row=middle_east, distance=2) # 2
        TagDistances.objects.create(col=middle_east, row=tag, distance=2) #TODO
    greek = Tag.objects.get(title='Greek')
    for tag1 in greek_food:
        TagDistances.objects.create(col=greek, row=tag1, distance=1) #1
        #TagDistances.objects.create(col=tag1, row=tag1, distance=0) #0
        for tag2 in greek_food:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # Ero tags
    ero = Tag.objects.get(title='European')
    # TagDistances.objects.create(col=ero, row=ero, distance=0)
    for tag in eropean_cat:
        TagDistances.objects.create(col=ero, row=tag, distance=2)
    italy = Tag.objects.get(title='Italian')
    for tag1 in italian_food:
        TagDistances.objects.create(col=italy, row=tag1, distance=1)
        #TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in italian_food:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # General tags
    general = Tag.objects.get(title='General Food')
    # TagDistances.objects.create(col=general, row=general, distance=0)
    for tag1 in general_cat:
        TagDistances.objects.create(col=general, row=tag1, distance=2)
        # TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in general_cat:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # American tags
    american = Tag.objects.get(title='American')
    # TagDistances.objects.create(col=american, row=american, distance=0)
    for tag1 in american_cat:
        TagDistances.objects.create(col=american, row=tag1, distance=2)
        #TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in american_cat:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # Asian tags:
    asian = Tag.objects.get(title='Asian')
    # TagDistances.objects.create(col=asian, row=asian, distance=0)
    for tag in asian_cats:
        TagDistances.objects.create(col=asian, row=tag, distance=2)

    japan = Tag.objects.get(title='Japanese')
    for tag1 in japanease_food:
        TagDistances.objects.create(col=japan, row=tag1, distance=1)
        # TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in japanease_food:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    chaina = Tag.objects.get(title='Chainese')
    for tag1 in chainese_food:
        TagDistances.objects.create(col=chaina, row=tag1, distance=1)
        # TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in chainese_food:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=1)


    # Deserts tags
    Desert = Tag.objects.get(title='Deserts')
    TagDistances.objects.create(col=general, row=Desert, distance=0)
    for tag1 in deserts:
        TagDistances.objects.create(col=Desert, row=tag1, distance=2)
        # TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in deserts:
            if tag1 != tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=1)

def create_another_tags_dists():
    middle_east_cat = Tag.objects.filter(parent_id='22')
    eropean_cat = Tag.objects.filter(parent_id='36')
    general_cat = Tag.objects.filter(parent_id='19')
    american_cat = Tag.objects.filter(parent_id='5')
    asian_cats = Tag.objects.filter(parent_id='8')
    deserts = Tag.objects.filter(parent_id='14')
    greek_food = Tag.objects.filter(parent_id='23')
    italian_food = Tag.objects.filter(parent_id='1')
    japanease_food = Tag.objects.filter(parent_id='9')
    chainese_food = Tag.objects.filter(parent_id='10')

    all_tags = Tag.objects.all()

    # middle east subtree
    middle_east_subtree = [Tag.objects.get(title='Middle East')]+list(middle_east_cat)+list(greek_food)
    for tag_middle in middle_east_subtree:
        for gen_tag in all_tags:
            if gen_tag not in middle_east_subtree:
                TagDistances.objects.create(col=tag_middle, row=gen_tag, distance=3)

    # Ero subtree
    Ero_subtree = [Tag.objects.get(title='European')]+list(eropean_cat)+list(italian_food)
    for tag_ero in Ero_subtree:
        for gen_tag in all_tags:
            if gen_tag not in Ero_subtree:
                TagDistances.objects.create(col=tag_ero, row=gen_tag, distance=3)

    #General Tags:
    General_subtree = [Tag.objects.get(title='General Food')]+list(general_cat)
    for tag_general in General_subtree:
        for gen_tag in all_tags:
            if gen_tag not in General_subtree:
                TagDistances.objects.create(col=tag_general, row=gen_tag, distance=3)

    #American Tags:
    American_subtree = [Tag.objects.get(title='American')]+list(american_cat)
    for American_tag in American_subtree:
        for gen_tag in all_tags:
            if gen_tag not in General_subtree:
                TagDistances.objects.create(col=American_tag, row=gen_tag, distance=3)


    # Asian subtree
    Asian_subtree = [Tag.objects.get(title='Asian')]+list(asian_cats)+list(chainese_food)+list(japanease_food)
    for tag_asian in Asian_subtree:
        for gen_tag in all_tags:
            if gen_tag not in Asian_subtree:
                TagDistances.objects.create(col=tag_asian, row=gen_tag, distance=3)

    #Desert Tags:
    Desert_subtree = [Tag.objects.get(title='Deserts')]+list(deserts)
    for Desert_tag in Desert_subtree:
        for gen_tag in all_tags:
            if gen_tag not in General_subtree:
                TagDistances.objects.create(col=Desert_tag, row=gen_tag, distance=3)

